# 64_figma_migration.md

## 参照タイミング
Figma デザインシステムを別プロジェクト・別ファイルへ移植する場合に参照する。

## このファイルについて
**このファイルは「デザインシステム変換規約」である（役割分類：60番台）。**
Figma Variables / Styles をプロジェクト間で移植する手順を定義する。
AI は新規プロジェクト立ち上げ時、または既存資産の取り込み時にこのファイルを参照すること。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-16
---

# Figma 移植フロー

## 1. 軽量移植（Variables のみ）

トークン値だけをコード側パイプラインへ渡したい場合：

1. ソース Figma で `Variables2JSON` プラグイン等を使い `tokens.json` を書き出す
2. 移植先プロジェクトのリポにコミット
3. Style Dictionary 等で各言語ターゲット（CSS/SCSS/TS/Tailwind）へ変換
4. 詳細な出力仕様は `63_design_tokens_output.md` を参照

※ Styles（Text/Effect）は移植されない点に注意。

## 2. 完全移植（Variables + Styles）

Figma 上で全資産をローカル化したい場合：

1. ソースファイルで `[Guide]` フレーム全体を Copy
2. 移植先ファイルに Paste
3. 全 Variables + Styles がローカル変数 / スタイルとして自動作成される
4. 不要な `[Guide]` フレームは削除

メリット：
- API 経由では失われる Style 構造（lh/ls の PERCENT 値など）が保持される
- L/D・PC/SP の全モードがそのまま引き継がれる

## 移植後検証チェックリスト（詳細）

完全移植後、以下を順に確認：

### Variables
- [ ] 全 Collection が作成されている（NDS_v2 等）
- [ ] 4モード（PC-Light / SP-Light / PC-Dark / SP-Dark）が揃っている
- [ ] Config 層が `scopes = []` で picker 非表示のまま
- [ ] Theme 層の L/D 切替が正しく動作
- [ ] PC/SP 差分のある Variable（gap-*, section-*）が正しい値
- [ ] `_Reserved/` 配下が存在し、`⚠_` prefix 変数が含まれる
- [ ] STRING 変数（Content 系）が移植されている

### Styles
- [ ] Text Styles 10種が全て存在
- [ ] Text Style 内の fontSize / fontWeight が Variable 参照
- [ ] Text Style の lineHeight / letterSpacing が PERCENT / em で保持
- [ ] Effect Styles 11種が全て存在
- [ ] Drop Shadow / Backdrop Blur / Inner Shadow / Focus Ring の全カテゴリ

### Guide
- [ ] Config ガイド（A-1〜A-n）が視覚表示される
- [ ] Theme ガイド（B-1〜B-n）の L/D 比較が動作
- [ ] 全チップ / バー / サンプルが正しく bind を維持

上記に問題があれば、該当 Variable / Style を個別に再調整。

## 3. マスターテンプレート運用

中央集権的に管理する場合：

- 「Design System Master」ファイルを作成し、全プロジェクトの起点とする
- 新規プロジェクトはマスターを **複製** して開始
- 改修はマスターに反映 → 各プロジェクトへは差分手動同期

## 4. 移植後チェック

- `_Reserved/` 配下が消えていないか（Figma API の制約回避用、削除しない）
- Config 層の `scopes = []` が維持されているか（picker 非表示設定）
- L/D・PC/SP の 4モードが揃っているか
- Text Style の lineHeight / letterSpacing が PERCENT / em で保持されているか

詳細な命名規約は `60_figma_variables.md` / `61_figma_styles.md` を参照。

---

## 関連ドキュメント

- `32_generation_rules.md` — 絶対ルール（SSOT）
- `60_figma_variables.md` — 移植対象の Variable 規約
- `61_figma_styles.md` — 移植対象の Style 規約
- `65_figma_constraints.md` — 移植時に踏みやすい API 制約
- `66_figma_guide_structure.md` — Guide 構造の維持方法（完全移植の鍵）
- `67_design_system_workflow.md` — 新規 DS 立ち上げ時のワークフロー
