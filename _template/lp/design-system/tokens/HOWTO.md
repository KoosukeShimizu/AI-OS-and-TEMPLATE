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

## 更新時

Figma DS を更新したら：

1. 再度 `tokens.json` をエクスポート
2. AI に再変換を依頼（`_theme.scss` を上書き生成）
3. 差分を確認し、旧命名を参照している箇所があれば `design-system/decisions.md` に記録
4. 必要なら `ai-runtime/ai_decision_log.md` にも実装側の影響を記録

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
