# CLAUDE.md

このプロジェクトは **AI-OS フレームワーク準拠** です。
作業開始前に以下のルールセットを必ず読んでください。

## 起動時の読み込み順

1. `@_ai-os/00_start.md` — AI-OS 全体の起動ガイド
2. `@_ai-os/32_generation_rules.md` — 絶対ルール（SSOT、最優先）
3. プロジェクト固有情報：
   - `@design-system/README.md` — このプロジェクトのDS概要
   - `@design-system/decisions.md` — 意思決定の履歴
   - `@design-system/figma-reference.md` — Figmaファイル参照

## デザインシステム系作業時

Figma連携・トークン変換・スタイルガイド制作時は以下を参照：

- `@_ai-os/60_figma_variables.md` — Variable命名規約
- `@_ai-os/61_figma_styles.md` — Style命名規約
- `@_ai-os/62_figma_mode_handling.md` — L/D・PC/SPモード処理
- `@_ai-os/63_design_tokens_output.md` — トークン出力仕様
- `@_ai-os/64_figma_migration.md` — プロジェクト間移植フロー
- `@_ai-os/65_figma_constraints.md` — Figma API既知制約
- `@_ai-os/66_figma_guide_structure.md` — Style Guide設計
- `@_ai-os/67_design_system_workflow.md` — DS制作4ステップ

## プロジェクト固有ルールの優先順位

`32_generation_rules.md`（絶対ルール） >
`design-system/decisions.md`（プロジェクト決定） >
`_ai-os/` 60番台（一般規約）

矛盾が発生した場合は上位を優先。
