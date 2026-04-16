# 63_design_tokens_output.md

## 参照タイミング
デザイントークンを CSS / SCSS / TS / Tailwind に出力する場合に参照する。

## このファイルについて
**このファイルは「デザインシステム変換規約」である（役割分類：60番台）。**
Figma Variables / Styles の最終出力フォーマットを定義する。
AI はトークンファイル生成時、このファイルを必ず参照すること。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-16
---

# Design Tokens 出力仕様

## 基本フォーマット
プロジェクトに応じて選択：
1. CSS Custom Properties（`--token-name`）
2. SCSS Variables（`$token-name`）
3. TypeScript Object（`tokens.tokenName`）
4. Tailwind Config（`theme.extend`）

## 変換ルール例

### Figma Variable
```
Theme/02_Surface/bg-default → Light: #ffffff / Dark: #0a0e1a
```

### CSS出力
```css
:root { --bg-default: #ffffff; }
[data-theme="dark"] { --bg-default: #0a0e1a; }
```

### SCSS出力
```scss
$bg-default: var(--bg-default);
```

### TS出力
```ts
export const tokens = { bgDefault: 'var(--bg-default)' };
```

## Style の出力

### Text Style → クラス
```
Heading/heading-h1 → .heading-h1
```

### Effect Style → クラス
```
Shadow/shadow-xs → .shadow-xs { box-shadow: ...; }
```

## 変換時の leaf 名ルール

AI が Variable / Style をコードに変換する時：

1. **階層を無視**：`Theme/01_Brand/primary` の `Theme/`, `01_Brand/` 部分は出力に含めない
2. **leaf のみ採用**：`primary` が出力対象（`--primary`, `.primary`, `primary` 等）
3. **言語別の case 変換**：
   - CSS Custom Properties: kebab-case（`--bg-default`）
   - SCSS Variables: kebab-case（`$bg-default`）
   - TypeScript Object: camelCase（`tokens.bgDefault`）
   - Tailwind Config: kebab-case（`'bg-default': ...`）

### _Reserved / ⚠_ の扱い

- `_Reserved/` 配下の Variable は出力から除外
- `⚠_` prefix のついた Variable も同様に除外
- 詳細は `65_figma_constraints.md` の退避ルール参照

## 推奨ツール

| ツール | 用途 |
|-------|------|
| Variables2JSON（Figma plugin） | Figma Variables → tokens.json |
| Style Dictionary | tokens.json → CSS / SCSS / JS / Swift / Kotlin |
| Tokens Studio for Figma | Figma 内でトークン管理 + 書き出し |
| Figma Variables REST API | 自作スクリプトで直接取得 |

## MCP 経由での活用

Figma MCP Server を利用すれば、AI エージェントが直接 Figma から Variable 情報を取得可能：

- `get_variables` で現状のトークンを取得
- `get_styles` で Text / Effect Style を取得
- 取得した情報は本ファイルのルールに従ってコード変換
- 中間 JSON を経由しない直接変換も可能

## AI 変換方式（Node 非依存の推奨パイプライン）

Node / Style Dictionary を導入しないプロジェクト（Prepros ベース等）では、**AI に `tokens.json` を読ませて SCSS を直接生成する**方式を採用できる。

### パイプライン
```
Figma Variables / Styles
  ↓ （Variables2JSON）
design-system/tokens/tokens.json
  ↓ （AI に依頼）
scss/_foundation/_theme.scss
```

### 依頼例
> `design-system/tokens/tokens.json` を `63_design_tokens_output.md` の仕様に従って `scss/_foundation/_theme.scss` に変換してください。

### メリット
- Node 環境不要、Prepros ワークフローを壊さない
- Claude Code 前提のプロジェクトなら自然な運用
- 変換ルールが本ファイルに集約される（Single Source of Truth）

### 運用詳細
プロジェクトテンプレの `_template/{site,lp}/design-system/tokens/HOWTO.md` に実行手順・検証項目を記載。
Figma DS を更新したら AI に再変換を依頼し、差分を `design-system/decisions.md` に記録する。

## 中間JSON形式（推奨：W3C DTCG）

Figma → `tokens.json` → 各言語に変換するパイプラインが推奨。
W3C Design Tokens Community Group（DTCG）形式に準拠することで、複数ツール間の互換性が確保される。

`tokens.json`（抜粋）:
```json
{
  "bg-default": {
    "$value": "#ffffff",
    "$type": "color",
    "$description": "標準背景色"
  },
  "gap-m": {
    "$value": "16px",
    "$type": "dimension"
  }
}
```

変換ツール候補：
- Tokens Studio for Figma
- Style Dictionary
- Figma Variables REST API + 自作スクリプト

## Figma からの書き出しフロー

1. Figma で `Variables2JSON` などのプラグインを使用
2. `tokens.json` をプロジェクトリポにコミット
3. ビルド時に Style Dictionary 等で各言語ターゲットに変換
4. 生成された CSS / SCSS / TS をコードから import

※ プロジェクト間の移植フローは `64_figma_migration.md` を参照。

---

## 関連ドキュメント

- `32_generation_rules.md` — 絶対ルール（SSOT）
- `60_figma_variables.md` — 入力側の Variable 規約
- `61_figma_styles.md` — Style の出力パターン
- `62_figma_mode_handling.md` — モードを反映した CSS 出力
- `64_figma_migration.md` — トークン JSON を使った軽量移植フロー
