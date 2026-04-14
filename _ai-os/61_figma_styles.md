# 61_figma_styles.md

## 参照タイミング
Figma Styles（Text/Effect）をクラス・スタイルへ変換する場合に参照する。

## このファイルについて
**このファイルは「デザインシステム変換規約」である（役割分類：60番台）。**
Figma Styles の命名構造・Variable との使い分けを定義する。
AI は Text Style / Effect Style をコード化する際、このファイルを必ず参照すること。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-14
---

# Figma Styles 運用規約

## Styles の位置づけ
- Variables が primitive / semantic tokens、Styles は **複合レシピ**
- Typography（fontSize + weight + lineHeight + letterSpacing）
- Effect（shadow / blur / inner / focus）

## 命名構造
```
Group/leaf-name
例: Heading/heading-h1
    Shadow/shadow-xs
    Blur/blur-s
```

- Group は PascalCase（`Heading`, `Body`, `UI`, `Shadow`, `Blur`, `Inner`, `Focus`）
- leaf は全て self-descriptive な kebab-case
- **AI は leaf 名のみをクラス名・スタイル名として使用**

## Text Styles（10種）
- `Heading/heading-h1 〜 h4` → `.heading-h1` 等
- `Body/text-lead / text-main / text-sub / text-caption` → `.text-main` 等
- `UI/text-button / text-label`

leaf名は全て `text-*` または `heading-*` で始まる。

## Effect Styles
- `Shadow/shadow-xs 〜 shadow-xl` → `.shadow-xs`
- `Blur/blur-s 〜 blur-lg` → `.blur-s`
- `Inner/inner-input / inner-pressed` → `.inner-input`
- `Focus/focus-ring` → `.focus-ring`

## Variable と Style の使い分け
| 対象 | どちらで管理 |
|------|------------|
| 色（単色） | Variable（L/D切替がある） |
| グラデーション | Paint Style |
| Typography複合 | Text Style（内部でVariable参照） |
| Shadow複合 | Effect Style（内部でVariable参照） |
| 単一数値（spacing/radius/width） | Variable |

## Text Styles（全10種）

| スタイル名 | fontSize | weight | lineHeight | letterSpacing |
|----------|---------|--------|-----------|--------------|
| Heading/heading-h1 | fz-h1 (40) | fw-bold | 125% | -0.01em |
| Heading/heading-h2 | fz-h2 (32) | fw-bold | 125% | -0.01em |
| Heading/heading-h3 | fz-h3 (24) | fw-bold | 140% | 0 |
| Heading/heading-h4 | fz-h4 (20) | fw-med | 140% | 0 |
| Body/text-lead | fz-body-l (18) | fw-reg | 180% | 0 |
| Body/text-main | fz-body-m (16) | fw-reg | 160% | 0 |
| Body/text-sub | fz-body-s (13) | fw-reg | 160% | 0 |
| Body/text-caption | fz-caption (11) | fw-reg | 140% | 0.02em |
| UI/text-button | fz-body-m (16) | fw-med | 100% | 0 |
| UI/text-label | fz-body-s (13) | fw-med | 140% | 0.02em |

## Effect Styles（全11種）

| カテゴリ | スタイル名 | 用途 |
|---------|----------|------|
| Shadow | shadow-xs / s / m / l / xl | カード・モーダル・フローティング |
| Blur | blur-s / m / lg | backdrop-filter すりガラス |
| Inner | inner-input / inner-pressed | インプット・押下 |
| Focus | focus-ring | フォーカスリング |

## なぜ lh/ls を Style で管理するか

Variable バインドでは unit が PIXELS に強制変換される制約があるため、
`lineHeight`・`letterSpacing` は Text Style 内で PERCENT・em を直接指定して管理する。
Figma 上で Text Style を適用すれば、unit が保持された正しい値になる。
（背景の根拠は `60_figma_variables.md` の `_Reserved/` 節を参照）
