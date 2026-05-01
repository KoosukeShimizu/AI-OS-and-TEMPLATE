# 69 — Figma でデザインを作る（NDS_v2 適用ルール）

AI が use_figma MCP を使って実デザインを生成するときのルールセット。
コード変換より前に「正しい Figma デザインを作ること」を目的とする。

---

## §0 デザイン開始前の鉄則

### ワイヤーフレーム段階からトークン思考を適用する

ワイヤー段階から以下を守る。「あとで色をつける」段階での修正を防ぐ。

- **primary は1画面に1 CTA のみ**（複数の強調に primary を使わない）
- **テキストは `text-main` → `text-sub` → `text-muted` の3階層で意味を分ける**
- **Gap と Section を混在させない**（セクション間には Section、要素間には Gap）
- ワイヤー時点で全要素に同色（赤一色など）を使わない

> **きっかけ：** ワイヤーで NDS_v2 ルールを無視して primary を全 CTA・全強調に使ったところ、レビューで全面修正が必要になった。

---

### Auto Layout 必須ルール

Figma でのデザイン作業はオートレイアウトを最大限使用する。絶対座標・固定高さは原則禁止。

**適用対象：** フレーム・セクション・カード・ボタン等、すべての要素

```
layoutMode: "HORIZONTAL" or "VERTICAL"
layoutSizingHorizontal: "FILL" or "HUG"
layoutSizingVertical: "FILL" or "HUG"
```

**Plugin API での注意：**
- 子ノードは必ず **親フレームに appendChild してから** `layoutSizingHorizontal/Vertical` を設定する
- append 前の設定は無効になる（Figma の制約）

> **きっかけ：** 全要素を絶対座標で配置したため、要素追加のたびに Y 座標を手作業修正する羽目になった。また Plugin API での append 順序依存という制約をその場で発見した。

---

## §1 Surface（背景・面）の選択ルール

| トークン | 使う場面 |
|---------|---------|
| `bg-default` | ページ全体の最背面（body相当） |
| `bg-surface` | カード・パネル・モーダル背景（bg-default の上に浮く面） |
| `bg-raised` | ドロップダウン・ツールチップ・ポップオーバー（bg-surface の上に浮く） |
| `bg-deep` | サイドバー・ナビ内の凹んだエリア（bg-surface より沈む） |
| `bg-header` | ヘッダー固定領域専用 |
| `bg-footer` | フッター固定領域専用 |
| `bg-side` | サイドバー専用 |
| `bg-hover` | インタラクティブ要素の hover 状態の背景色 |
| `bg-selected` | 選択済み状態の背景色 |
| `bg-overlay` | モーダルなどの背面オーバーレイ（半透明） |
| `bg-inverse` | ダーク系バナーや反転ブロック内の背景 |

**NG パターン**：
- `bg-raised` をページ最背面に使う（浮かせる対象がない）
- `bg-deep` と `bg-raised` を同一レベルで並べる（深さの矛盾）
- Config 層の色（例：`slate-100`）を直接フィルに使う

---

## §2 Text の選択ルール

| トークン | 使う場面 |
|---------|---------|
| `text-main` | 本文・見出しなど主要なテキスト全般 |
| `text-sub` | 補助説明・ラベル（main より1段落ちる） |
| `text-muted` | 日付・メタ情報・控えめな補足 |
| `text-placeholder` | input の placeholder 専用 |
| `text-disabled` | 無効化された要素のテキスト |
| `text-link` | アンカーリンク専用 |
| `text-inverse` | bg-inverse などの暗い背景上のテキスト |
| `on-primary` | primary 色の背景上のテキスト（ボタンラベルなど） |
| `on-secondary` | secondary 色の背景上のテキスト |
| `on-notice` | error/warning/success/info 背景上のテキスト |

**ルール**：
- `text-main` → `text-sub` → `text-muted` の順に視覚的階層を作る
- bg-default 上に `text-inverse` は使わない（コントラスト破綻）
- primary ボタンラベルは `on-primary`（`text-main` ではない）

---

## §3 Brand / Notice カラーの使用ルール

### Brand
| トークン | 用途 |
|---------|------|
| `primary` | CTA ボタン・主要アクション・リンク強調（1画面に1箇所が目安） |
| `primary-hover` / `primary-active` | インタラクション状態（デザイン上は primary と差し替え） |
| `primary-disabled` | 非活性の primary ボタン |
| `primary-tint` | primary の淡色バリアント（バッジ背景・タグ・選択ハイライト） |
| `secondary` | 補助的な強調（primary と同時に使うと競合するため注意） |
| `secondary-tint` | secondary の淡色バリアント |

**禁止**：
- primary と secondary を同一 CTA エリアに並べない
- primary-tint をボタン背景に使わない（tint は面・バッジ用）

### Notice
```
error-default   / error-sub   / error-border
warning-default / warning-sub / warning-border
success-default / success-sub / success-border
info-default    / info-sub    / info-border
```
- `*-default` → アイコン・テキスト強調色
- `*-sub` → 背景・バナー面色
- `*-border` → ボーダー・区切り線色
- ラベルテキストは `on-notice` を使う

---

## §4 Gap / Section / Width の選択ルール

### Gap（要素間・内側 padding）

| トークン | 実寸 PC / SP | 用途の目安 |
|---------|-------------|---------|
| `gap-xxs` | 4 / 2px | アイコンとラベルの隙間 |
| `gap-xs` | 8 / 4px | 密集したリスト行間 |
| `gap-s` | 12 / 8px | カード内 padding・小コンポーネント |
| `gap-m` | 16 / 12px | 標準 padding・フォーム行間 |
| `gap-l` | 24 / 16px | セクション内グループ間 |
| `gap-xl` | 32 / 24px | カード間・グリッドの溝 |
| `gap-xxl` | 48 / 32px | 大きなブロック間 |

### Section（セクション上下余白）

| トークン | 実寸 PC / SP | 用途 |
|---------|-------------|------|
| `section-s` | 40 / 32px | 小セクション・フォーム内グループ |
| `section-m` | 64 / 48px | 標準セクション上下 padding |
| `section-l` | 96 / 64px | ヒーロー・大きなコンテンツ区切り |
| `section-xl` | 160 / 96px | LP トップ・フルスクリーンセクション |

**ルール**：Gap と Section は混ぜない（Section を要素間に使わない）

### Width（コンテナ幅）

| トークン | 用途 |
|---------|------|
| `w-cont-default` | ページ標準コンテナ |
| `w-cont-post` | ブログ記事・長文コンテンツ |
| `w-cont-form` | フォーム最大幅（入力欄が広がりすぎない） |
| `w-cont-dialog` | モーダル・ダイアログ |
| `w-sidebar` | サイドバー固定幅 |

---

## §5 Radius の選択ルール

| トークン | 実寸 | 用途 |
|---------|------|------|
| `rad-none` | 0px | テーブル行・フル幅バナー |
| `rad-xs` | 2px | タグ・バッジ・小さいチップ |
| `rad-s` | 4px | input・select・小ボタン |
| `rad-m` | 8px | カード・標準ボタン・ドロップダウン |
| `rad-l` | 12px | モーダル・大きなカード |
| `rad-xl` | 16px | ヒーローカード・ウィジェット |
| `rad-full` | 9999px | ピル型ボタン・アバター・トグル |

**ルール**：同一コンポーネント内で radius を混在させない（カード `rad-m` ならカード内ボタンも `rad-m` 以下）

---

## §6 Typography（Text Style）の選択ルール

Text Style は Figma の「Style」として管理（Variable ではない）。

| Style | 用途 |
|-------|------|
| `Heading/heading-h1` | ページタイトル・LP ヒーロー見出し |
| `Heading/heading-h2` | セクション見出し |
| `Heading/heading-h3` | サブセクション・カード見出し |
| `Heading/heading-h4` | 小見出し・サイドバー項目 |
| `Body/text-lead` | リード文・強調本文 |
| `Body/text-main` | 標準本文 |
| `Body/text-sub` | 注釈・補足説明 |
| `Body/text-caption` | 図版キャプション・超小テキスト |
| `UI/text-button` | ボタンラベル・CTA テキスト |
| `UI/text-label` | フォームラベル・タグ・バッジテキスト |

---

## §7 use_figma MCP でデザインを生成する手順

### 前提

**プロジェクト開始時の必須セットアップ：**
1. NDS_v2 の変数コレクションをプロジェクトファイルに **ローカルバリアブルとして手動インポート** する
   - ライブラリリンク（有効化のみ）ではなく、ローカルコピーとして持つ
   - これにより Theme 層のプロジェクト固有カスタマイズが可能になる
2. インポート後のカスタマイズルール：
   - **Config 層は絶対に変更しない**（NDS_v2 原本の汚染禁止）
   - **Theme 層の変数値のみを変更する**（ブランドカラー等の上書きはここで行う）
   - Config に対応するプリミティブがあれば alias で参照し、なければ Theme に直値（カラーコード）を設定してよい

> **きっかけ：** ライブラリリンクのみでは Theme 層をカスタマイズできず、プロジェクト固有ブランドカラーの適用方法が不明確だった。また Config / Theme どちらを変更すべきかの方針が未文書だった。

- Figma ファイル：`eZuOYxqc0RHxSkFQ0K6jWj`（NDS_v2）
- 変数コレクション：`NDS_v2`（Theme 層のみ参照）
- MCP ツール：`use_figma`（Plugin API 実行）、`generate_figma_design`（自然言語→デザイン生成）

### A. generate_figma_design を使う場合（推奨・高速）

```
AI への指示例：
「NDS_v2 のトークンを使って、サービス LP のヒーローセクションを
 Figma に生成してください。
 背景: bg-default、見出し: heading-h1 + text-main、
 CTA ボタン: primary、コンテナ幅: w-cont-default」
```

AI は `generate_figma_design` を呼び出してフレームを生成する。
生成後に `get_screenshot` でビジュアル確認し、トークン適用を検証する。

### B. use_figma（Plugin API）で精密制御する場合

**前提：ファイル形式による API の使い分け**

| 状況 | 使う API |
|------|---------|
| NDS_v2 ファイル内で直接作業 | `figma.variables.getLocalVariables()` |
| 別ファイルに NDS_v2 をライブラリとしてリンク | `figma.variables.importVariableByKeyAsync(key)` |

ライブラリ参照時に `getLocalVariables()` を使っても NDS_v2 の変数は取得できない（詳細：`65_figma_constraints.md` §非同期API必須）。

```javascript
// ── パターン①：NDS_v2 ファイル内で直接作業する場合 ──
const frame = figma.createFrame();
frame.name = "Hero Section";
frame.resize(1280, 600);

const bgVar = figma.variables.getLocalVariables()
  .find(v => v.name === "Theme/02_Surface/bg-default");
if (bgVar) {
  frame.setBoundVariable("fills", 0, "color", bgVar);
}

// ── パターン②：別ファイルで NDS_v2 をライブラリ参照している場合 ──
// まず get_variable_defs で対象変数の key を取得してから import する
const bgVar = await figma.variables.importVariableByKeyAsync("VARIABLE_KEY_HERE");
if (bgVar) {
  frame.setBoundVariable("fills", 0, "color", bgVar);
}
```

**手順**：
1. `get_variable_defs` で NDS_v2 の Variable ID / key を取得
2. 作業ファイルの状況に応じてパターン①②を選択
3. Plugin API でフレーム・テキスト・図形を生成し `setBoundVariable` でバインド
4. `get_screenshot` でビジュアル確認

### トークン名 → Variable パス の対応

```
--bg-default    → Theme/02_Surface/bg-default
--text-main     → Theme/03_Text/text-main
--primary       → Theme/01_Brand/primary
--gap-m         → Theme/06_Spacing/Gap/gap-m
--rad-m         → Theme/08_Radius/rad-m
```

---

## §8 デザイン生成チェックリスト

AI がデザインを生成・レビューするときに確認する項目：

- [ ] 背景に Config 層の色（例：`gray-100`）を直接使っていないか
- [ ] Surface の深さが論理的か（bg-default → bg-surface → bg-raised の順）
- [ ] テキストカラーが背景と対応しているか（`on-primary` など）
- [ ] Gap と Section を混在させていないか
- [ ] primary を複数 CTA に使っていないか
- [ ] Text Style が指定されているか（fontSize を直打ちしていないか）
- [ ] Radius が同一コンポーネント内で統一されているか

---

## §9 コンポーネントができたあとの拡張（TODO）

現時点（2026-05）では NDS_v2 にUI コンポーネント（Button / Card / Input 等）は未作成。
作成後にこのドキュメントへ追記する：

```
§10 コンポーネントカタログ（バリアント一覧）
§11 バリアント選択ルール（State / Size / Type）
§12 コンポーネント → HTML/Pug 変換パターン
```
