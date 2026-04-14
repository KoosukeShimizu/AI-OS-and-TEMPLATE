# 63_design_tokens_output.md

## 参照タイミング
デザイントークンを CSS / SCSS / TS / Tailwind に出力する場合に参照する。

## このファイルについて
**このファイルは「デザインシステム変換規約」である（役割分類：60番台）。**
Figma Variables / Styles の最終出力フォーマットを定義する。
AI はトークンファイル生成時、このファイルを必ず参照すること。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-14
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
