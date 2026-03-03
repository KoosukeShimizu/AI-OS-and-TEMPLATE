# _AI-PROJECT-START_LP.md

## このファイルについて
本ファイルは「新規LP案件」をAIで開始するための起動指示書である。
GitHub上のAI-OSを参照しつつ、本案件内にai-runtimeを生成して運用する。

---

## 0. 前提（最重要）

- OSは GitHub `KoosukeShimizu/AI-OS-and-TEMPLATE` を参照する
- エントリーポイントは `_ai-os/00_start.md`
- 推測で進めない
- ai-runtime未作成で実装しない

---

## 1. OS参照

以下を必ず実行：

1. `_ai-os/00_start.md` を読む
2. `_ai-os/11_interview.md` に従いヒアリング開始（1問ずつ）
3. `_ai-os/12_scope_checklist.md` 実施
4. `_ai-os/90_context_template.md` を元に `ai-runtime/ai_context.md` 生成
5. Mode決定（31_design_modes.md）
6. `_ai-os/91_outline_template.md` から `ai-runtime/ai_outline.md` 作成

---

## 2. テンプレ選定

本案件は **LPテンプレを使用する**

参照：
_template/lp/

展開は差分運用。
全面置換は禁止。

---

## 3. 実装ルール

- 常時 `_ai-os/32_generation_rules.md` を適用
- 重要判断は `ai-runtime/ai_decision_log.md` に記録

---

## 4. 開始

ヒアリングStep1を開始してください。