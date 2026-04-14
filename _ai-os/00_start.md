# 00_start.md

## 参照タイミング
新規プロジェクト開始時に必ず参照する（エントリーポイント）。

## このファイルについて
AI実装OSのエントリーポイント。
新規プロジェクト開始時、AIは必ずこのファイルを読むこと。

Updated: 2026-04-14
---

# 必読セット定義（ロード分類）

AIは以下の分類に従ってファイルを参照する。

## 1. 常時参照（Always）

実装・判断のたびに常に参照する。

- 01_os_lock.md
- 32_generation_rules.md
- ai-runtime/ai_context.md
- ai-runtime/ai_outline.md

※ 出力前は必ず 32_generation_rules.md を適用すること。
※ ai_context.md が存在しない場合は、90_context_template.md をもとに作成してから続行すること。

---

## 2. 起動時のみ参照（Boot）

プロジェクト開始〜設計確定までの間のみ参照する。

- 00_start.md
- 11_interview.md
- 12_scope_checklist.md
- 90_context_template.md（生成時）
- 91_outline_template.md（生成時）
- 54_decision_log_format.md（記録時）

---

## 3. 条件付き参照（Conditional）

以下の条件に該当する場合のみ参照する。

- 31_design_modes.md  
  → Mode決定・変更時

- 35_structure_review.md
  → 条件：11_interview.md で Figma URL が確認済みかつ実装前

- 40_markup_pug.md  
  → Pug構造を編集する場合

- 41_style_scss.md  
  → SCSSを編集する場合

- 42_javascript.md  
  → JavaScriptを編集する場合

- 23_environment.md / 24_directory_structure.md  
  → 以下に該当する場合は必ず参照：
     - 新規ページ作成 / 新規ファイル作成が発生する
     - 新規フォルダ作成 / フォルダ移動 / リネーム / 削除が発生する
     - include構造（pug/_foundation・_layout・_component）の追加/変更を行う
     - 編集対象外（pug/ scss/ script/ ai-runtime/ 以外）に触れる可能性がある
     - 出力先（__dist/）や assets パスの判断が必要

- 20_mindset.md  
  → 設計方針の衝突・トレードオフが発生した場合

- 50〜53番台  
  → 実装後のレビュー・監査時のみ

- 60_figma_variables.md / 61_figma_styles.md / 62_figma_mode_handling.md / 63_design_tokens_output.md  
  → プロジェクトが Figma 連携を含む場合に必ず参照（実装前のトークン変換規約）

## デザインシステム参照
プロジェクトが Figma 連携を含む場合、以下を必ず参照：
- @60_figma_variables.md — 変数命名規約
- @61_figma_styles.md — スタイル命名規約
- @62_figma_mode_handling.md — L/D・PC/SP モード処理
- @63_design_tokens_output.md — トークン出力仕様

AIは不要なファイルを常時ロードしないこと。
各ファイルの「参照タイミング」に従うこと。

---

## ファイル役割の早見表

| 番号 | 役割分類 | 内容 |
|------|----------|------|
| 32 | **強制ルール** | AI実装時に必ず従う唯一の出力ルール。他より常に優先 |
| 40〜42 | **実装ガイド** | Pug / SCSS / JS の実装作法。32に矛盾する場合は32優先 |
| 50〜53 | **レビュー/監査** | 実装後の品質・パフォーマンス・a11y確認。実装中は参照不要 |
| 60〜63 | **デザインシステム変換規約** | Figma Variables/Styles/Modes → コードトークン変換ルール。Figma連携時に参照 |


---

# 実行手順（厳守）

## 1. ランタイムフォルダの確認

- ai-runtime フォルダが存在するか確認
- 存在しない場合は **プロジェクトルート直下に作成する**

例：
./ai-runtime/

※ 不可視フォルダである必要はない  
※ .ai-runtime ではなく通常フォルダでOK  

---

## 2. 生成・更新するファイル

AIは以下のファイルを ai-runtime 内で管理する：

- ai_context.md
- ai_outline.md
- ai_decision_log.md

※ テンプレートは /ai 配下の以下を参照すること：
- 90_context_template.md
- 91_outline_template.md
- 54_decision_log_format.md

---

## 3. 実行フロー

AIは以下の順番で処理すること：

1. 11_interview.md に従いヒアリング実施
2. 12_scope_checklist.md で必要ページ・機能を整理
3. 90_context_template.md をもとに ai_context.md を生成
4. 31_design_modes.md に従い Mode を決定し ai_context.md に記録
5. 91_outline_template.md をもとに ai_outline.md を生成

6. **（追加）テンプレ選定と雛形展開**
   - ai_context.md / ai_outline.md の確定後に「採用テンプレ」を決める
   - テンプレは /_template/ 配下の "site / lp" を参照する
   - **site / lp のどちらを使うかは、11_interview.md のヒアリング結果（プロジェクト種別）が確定してから決定する**
   - どちらを採用するかは ai_context.md の「プロジェクト種別 / 規模 / include運用」に従う
   - 以降の実装は、展開された雛形を前提に差分・追加で進める

7. 32_generation_rules.md に従い実装を開始
8. 重要判断が発生した場合は ai_decision_log.md に記録

---

## 4. テンプレ運用ルール（重要）

- テンプレは「見本 + 初期雛形」であり、案件ごとに調整してよい
- ただし **OSルール（/ai配下md）を破る変更はしない**
- テンプレの改修が必要になった場合は、原則として
  - ai-runtime/ai_decision_log.md に理由を残す
  - 後日テンプレへ反映（人間が判断）

---

## 5. 禁止事項

- ai_context.md 未作成で実装を開始してはいけない
- ai_outline.md 未確定でコードを書いてはいけない
- 既存コードを全面置換してはいけない
- 推測で設計判断をしてはいけない

---

## 6. 原則

- すべては ai_context.md を最優先にする
- 曖昧な点は必ず「未確定事項」に記録する
- 実装は差分・追加単位で進める
- 最終判断は人間が行う
- このプロジェクトは 01_os_lock.md の制約下で運用される。