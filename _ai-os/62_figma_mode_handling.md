# 62_figma_mode_handling.md

## 参照タイミング
Figma の L/D・PC/SP モードをコードへ落とし込む場合に参照する。

## このファイルについて
**このファイルは「デザインシステム変換規約」である（役割分類：60番台）。**
Figma Modes（Light/Dark, PC/SP）の CSS 変換ルールを定義する。
AI は theme/メディアクエリ生成時にこのファイルを必ず参照すること。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-14
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
