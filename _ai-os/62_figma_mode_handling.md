# 62_figma_mode_handling.md

## 参照タイミング
Figma の L/D・PC/SP モードをコードへ落とし込む場合に参照する。

## このファイルについて
**このファイルは「デザインシステム変換規約」である（役割分類：60番台）。**
Figma Modes（Light/Dark, PC/SP）の CSS 変換ルールを定義する。
AI は theme/メディアクエリ生成時にこのファイルを必ず参照すること。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-16
---

# Figma Modes ハンドリング

## モード構成
Figma 側は 4モード管理：
- PC-Light / SP-Light / PC-Dark / SP-Dark

## L/D モード → CSS 変換
- CSS変数は `:root` で Light、`[data-theme="dark"]` で Dark 上書き
- Figma モード切替 = コード上の theme 切替に対応

例:
```css
:root { --bg-default: #ffffff; }
[data-theme="dark"] { --bg-default: #0a0e1a; }
```

## PC/SP モード → メディアクエリ変換
- PC値 = デスクトップブレークポイント（1024px以上）
- SP値 = モバイルブレークポイント（〜767px）
- 変数が PC/SP で異なる値を持つ場合、CSS はメディアクエリで切替

例:
```css
:root { --gap-m: 16px; /* SP */ }
@media (min-width: 1024px) { :root { --gap-m: 20px; /* PC */ } }
```

※ 差分のない変数は media query 不要。

## ブレークポイント定義

PC/SP の境界はタブレット域（768〜1023px）が曖昧になりがちなので、明示する：

- **SP モード**: `max-width: 1023px`（モバイル・タブレット含む）
- **PC モード**: `min-width: 1024px`（デスクトップ）

タブレット専用ブレークポイントが必要な場合は、プロジェクト判断で 3 段階に分割：
- Mobile: `max-width: 767px`
- Tablet: `768px〜1023px`
- Desktop: `1024px 以上`

## システム設定の尊重（prefers-color-scheme）

ユーザーの OS テーマを優先する場合：
```css
:root { --bg-default: #ffffff; }
@media (prefers-color-scheme: dark) {
  :root { --bg-default: #0a0e1a; }
}
[data-theme="light"] { --bg-default: #ffffff; }
[data-theme="dark"] { --bg-default: #0a0e1a; }
```

`data-theme` はユーザー明示切替、media query はシステム推定。
明示切替が存在する場合は `data-theme` が media query を上書きする（カスケード優先）。

## 4モードの優先順位

Figma では `PC-Light / SP-Light / PC-Dark / SP-Dark` の4モードが標準。
ユーザーの実体験では以下の優先順位で切替が発生：

1. **OSのシステム設定**（light/dark） → `prefers-color-scheme` で検知
2. **ユーザー明示切替**（theme toggle） → `data-theme="dark"` で上書き
3. **ビューポート幅**（pc/sp） → `min-width` / `max-width` メディアクエリで切替

この3レイヤーが重畳するので、CSS 設計では優先度を：

```css
:root { /* SP-Light（デフォルト） */ }
@media (min-width: 1024px) { :root { /* PC-Light */ } }
@media (prefers-color-scheme: dark) {
  :root { /* SP-Dark */ }
  @media (min-width: 1024px) { :root { /* PC-Dark */ } }
}
[data-theme="dark"] {
  /* 明示切替時（メディアクエリを上書き） */
}
[data-theme="light"] {
  /* 明示切替時（メディアクエリを上書き） */
}
```

## モード差分の発生ポイント

すべての Variable が全モードで異なるわけではない。典型的な差分：

| カテゴリ | L/D 差 | PC/SP 差 |
|---------|--------|---------|
| Brand / Surface / Text / Border / Notice | ✅ あり | ❌ 通常なし |
| Spacing (Gap, Section) | ❌ なし | ✅ 1段ずらし推奨 |
| Width / Radius / FontSize | ❌ なし | 要件次第 |
| State Opacity | ❌ なし | ❌ なし |

PC/SP で小さくずらす運用（例：gap-m = PC:16, SP:12）は、デザイナーの手動調整を減らす鉄板パターン。

## FOUC（Flash of Unstyled Content）対策

`[data-theme="dark"]` での明示切替を採用する場合、**ページ初期ロード時に一瞬 Light → Dark のちらつき** が発生する。
対策として、CSS より前（`<head>` の早い段階）で `<script>` により初期テーマを判定する：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <script>
    (function() {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <link rel="stylesheet" href="style.css">
</head>
```

### ポイント
- `<script>` は **CSS 読み込みより前**（`<link rel="stylesheet">` の上）に置く
- IIFE で即時実行（defer/async を付けない）
- `localStorage` 優先 → 無ければ `prefers-color-scheme`
- テーマトグル UI からの切替は `document.documentElement.setAttribute('data-theme', ...)` + `localStorage.setItem('theme', ...)` の組み合わせ

### 注意
- この preflight script は外部ファイルにせず **インラインで埋め込む**（外部参照だとロードが遅れてちらつきが残る）
- `<script>` が増えるが、描画前に一度だけ実行される軽量処理なのでパフォーマンス影響は無視できる

---

## 関連ドキュメント

- `32_generation_rules.md` — 絶対ルール（SSOT）
- `60_figma_variables.md` — モード値を持つ Variables の命名
- `63_design_tokens_output.md` — モードを反映したトークン出力
- `64_figma_migration.md` — 4モードの移植時の保持方法
- `67_design_system_workflow.md` — モード設計を含む DS 制作プロセス
