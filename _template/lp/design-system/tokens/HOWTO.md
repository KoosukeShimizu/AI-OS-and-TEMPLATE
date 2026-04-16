# tokens.json から SCSS への変換手順（AI 変換方式）

このプロジェクトは **Node / Style Dictionary を使わず**、Claude Code（または同等の MCP 対応 AI）に `tokens.json` を読ませて SCSS を生成する運用を採用する。

---

## 変換パイプライン

```
Figma Variables / Styles
    ↓ （Variables2JSON などで書き出し）
tokens.json（このディレクトリ）
    ↓ （AI に依頼）
scss/_foundation/_theme.scss（自動生成）
    ↓ （@import）
scss/main.scss
```

---

## 実行手順

### 1. Figma からトークンを書き出す

- Figma 上で `Variables2JSON` プラグイン、または Variables REST API を使う
- 出力は **W3C DTCG 形式**（`$value` / `$type` / `$description` キーを持つ JSON）
- 参考フォーマット：`tokens.example.json`

### 2. `tokens.json` をこのディレクトリに配置

```
design-system/tokens/tokens.json
```

### 3. AI に変換を依頼

Claude Code 等で以下のように依頼する：

> `design-system/tokens/tokens.json` を `_ai-os/63_design_tokens_output.md` の仕様に従って `scss/_foundation/_theme.scss` に変換してください。

AI は以下のルールで変換する（`_ai-os/63_design_tokens_output.md` 準拠）：

- Figma leaf 名をそのまま kebab-case の CSS 変数名にする（`bg-default` → `--bg-default`）
- L/D モード → `:root`（Light）／`[data-theme="dark"]`（Dark）
- PC/SP モード → `@media (min-width: 1024px)` で上書き
- Text Style → `.heading-*` / `.text-*` クラス
- Effect Style → `.shadow-*` / `.blur-*` / `.inner-*` / `.focus-ring` クラス
- `_Reserved/` / `⚠_` prefix の変数は出力から除外

### 4. 生成された `_theme.scss` を確認

確認ポイント：

- [ ] 全 Theme 変数が `:root` に定義されている
- [ ] Dark モードが `[data-theme="dark"]` で上書きされている
- [ ] PC/SP 差分がある変数のみ `@media (min-width: 1024px)` で上書き
- [ ] Text Style / Effect Style がクラスとして出力されている
- [ ] 旧 `_tokens.scss` と命名が衝突していない（衝突時は `design-system/decisions.md` 参照）

### 5. `main.scss` から import

```scss
@import "./_foundation/_theme";
```

import 順は `_ai-os/41_style_scss.md` の「4. 読み込み順」に従う（_foundation の中で既存 `_tokens.scss` の後）。

---

## 更新時（差分更新ルール、重要）

Figma DS を更新したら：

### 初回生成
- `_theme.scss` が存在しない → 新規作成（上書き OK）

### 2 回目以降（既存 `_theme.scss` がある場合）
- **丸ごと上書きは禁止**。必ず以下の順で進める：

1. 再度 `tokens.json` をエクスポート
2. AI に **diff 形式で** 再変換を依頼：
   > `tokens.json` を `_theme.scss` と比較し、**追加・変更されたトークンのみ** を差分として提示してください。既存の手書きカスタマイズは温存してください。
3. AI が提示した diff を目視レビュー
4. 追加のみ・既存を壊さない変更 → 承認してマージ
5. **既存トークンの値変更・削除がある場合** → ユーザー確認必須
6. 差分を `design-system/decisions.md` に記録
7. 実装側の影響は `ai-runtime/ai_decision_log.md` にも記録

### 衝突時の挙動

- `_theme.scss` に手書きで追加したトークンがある（Figma に無い）→ **温存**
- Figma にあるが `_theme.scss` で値を上書きしている → ユーザー確認
- Figma から削除されたトークンが `_theme.scss` に残っている → 即削除せず、参照箇所を grep してから判断

### 4 モード JSON の構造依存

Variables2JSON の出力形式は **2パターン** あるため、AI に変換を依頼する際は形式を明示する：

- **パターン A（モード別オブジェクト）**：`$value` が `{ "PC-Light": "#fff", "PC-Dark": "#000", ... }` のオブジェクト
- **パターン B（モード解決済み）**：`$value` が単一文字列（特定モードのスナップショット）

パターン A が推奨（全モード情報を保持できる）。AI は A 形式の場合、L/D を `:root` と `[data-theme="dark"]` に、PC/SP を media query に展開する。

---

## なぜ Style Dictionary を使わないか

- このテンプレは **Prepros ベース** で、Node 環境を必須にしていない
- Claude Code 前提のプロジェクトなら AI 変換が現実的
- 将来 Node ワークフローに移行する場合は `_ai-os/63_design_tokens_output.md` の「推奨ツール」表を参照

---

## 関連

- `_ai-os/63_design_tokens_output.md` — 変換ルールの正
- `_ai-os/68_token_bridge.md` — 新旧トークン命名の橋渡し
- `../decisions.md` — DS 設計判断の記録先
