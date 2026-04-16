# 31_design_modes.md

## 参照タイミング
Mode決定/再確認が必要なタイミングで参照する（ヒアリング後〜実装前、または方針変更時）。

## このファイルについて
ヒアリング回答からAIが「設計モード」を自動決定し、
以降のアウトライン作成・実装方針を安定させるためのルールを定義する。

AIはヒアリング完了後：

- モードを決定する
- ai_context.md に Mode を記録する
- ai_outline.md に反映する
- 実装時は 32_generation_rules.md と整合させる

Updated: 2026-04-16
---

# 1. 設計モード一覧

## M1：Speed-first（スピード優先）

目的：
- 最短で動くものを作る

方針：
- 最小限の再利用性を残す
- 過剰な抽象化をしない
- コンポーネント抽出は必要最低限

禁止：
- 単発構造の乱立
- 全面置換

---

## M2：Reuse-first（再利用性優先）

目的：
- 横断利用できる部品設計

方針：
- コンポーネント抽出を厚めに
- 命名・構造を揃える
- 将来拡張を前提にする

注意：
- 抽象化しすぎて速度を落とさない

---

## M3：Legacy-safe（既存保護・差分優先）

目的：
- 既存ユーザー混乱を最小化
- 既存コードを破壊しない

方針：
- 差分追加で対応
- 既存命名・既存構造を尊重
- 影響範囲を明示

禁止：
- 全面リネーム
- ディレクトリ再構築

---

## M4：Data-dense（情報密度最適化）

目的：
- 情報量が多いUIでストレスを減らす

方針：
- 一覧 / テーブル / フィルタ設計を重視
- loading / empty / error 状態を明記
- 優先順位（L1 / L2 / L3）を明確にする

---

## M5：Design-faithful（デザイン再現優先）

目的：
- デザインの忠実再現

方針：
- 必要なラッパーを許容
- 微調整前提の構造にする
- セマンティクスは維持

---

# 2. モード決定ルール

## 2-1. 明示指定があれば最優先

ai_context.md の「優先順位」に従う。

例：

- 実装スピードが1位 → Primary=M1
- 再利用性が1位 → Primary=M2
- デザイン再現性が1位 → Primary=M5

---

## 2-2. プロジェクト型による推奨

- 管理画面 / ダッシュボード → Primary=M4
- 既存改修 / 差分対応 → Primary=M3
- LP（短納期 / 単発） → Primary=M1（Secondary=M5になりやすい）

---

## 2-3. 複合モード

最大2つまで採用可能。

例：
- Primary=M3 / Secondary=M2
- Primary=M4 / Secondary=M2

主モードが判断軸。副モードは補助。

---

# 3. モードの反映先

## ai_context.md

必ず以下を記録する：

## Mode
- Primary:
- Secondary:
- Reason:

---

## ai_outline.md

モードに応じて：

- セクション分解粒度を変える
- コンポーネント抽出量を調整する
- 状態設計の深さを変える

---

# 4. モードと構造の関係

- ディレクトリ構造は 24_directory_structure.md に従う（Modeで変更しない）
- 実装ルールは 23_environment.md / 32_generation_rules.md に従う
- Modeは「判断軸」であり、「構造変更権」ではない

---

# 5. モードの優先順位（衝突時）

- ai_context.md（Runtime）
- 30_conflict_resolution.md
- 20_mindset.md

上位が優先される。

---

# 6. Mode × DS 導入度マトリクス

11_interview.md の Step 6.1.5 で「DS あり」と判定された場合、Mode と組み合わせて **DS 導入の深さ** を決める。推奨値は以下：

| Mode | Figma DS 活用度 | トークン化の方針 | 備考 |
|------|----------------|----------------|------|
| M1：Speed-first | **Off or Full の二択**（中途半端禁止） | 使うなら全カテゴリ一貫。使わないなら生値 OK | 「色だけ Theme、spacing 生値」は禁止。後から DS 化する際に全置換が発生する |
| M2：Reuse-first | **Full** | 全カテゴリ Theme 経由、新規トークン追加は `decisions.md` に記録 | 横断利用前提なら DS の恩恵が最大化する |
| M3：Legacy-safe | **既存 SCSS を正 + Figma は監査用参照のみ** | 乖離時は SCSS を信じる | 68_token_bridge.md の「既存改修案件」枠。推測 rename 禁止。Figma は目視比較用 |
| M4：Data-dense | **Full** | 状態トークン（state-*）の活用を厚めに | loading / empty / error の見た目もトークン化 |
| M5：Design-faithful | **Full ＋ 厳格** | 生値禁止、Figma Theme 一致を最優先 | デザイナー意図の忠実再現には DS 一致が必須 |

## 6-1. 「中途半端禁止」の根拠

色だけ Theme、spacing だけ生値、という部分導入は後で必ず破綻する：

- 案件進行中に「spacing も DS 化したい」となった時、全コンポーネントの書き換えが必要
- AI が「このトークンは Theme？生値？」と判断する分岐が増え、出力が不安定になる
- レビュー時に「なぜここだけ生値？」の確認コストが毎回発生

**判断：DS を導入するなら 7 カテゴリ全て（色 / spacing / radius / shadow / typography / state / content）を Theme 経由で揃える。** 導入しないならゼロ。

## 6-2. 判断基準

- DS 未導入プロジェクトで後から DS 駆動に切替える場合：**Mode 変更と同等の判断**として `ai_decision_log.md` に記録
- M1 で DS Off を選ぶ場合も、その理由を `ai_context.md` に明記
- M3 で Figma と SCSS が乖離する状況を発見した場合：**SCSS を信じる**（Figma はあくまで監査用）。差異は `decisions.md` に記録し、次のリニューアルまで温存

## 6-3. 運用ガイド

- **新規案件 × M2 / M4 / M5** ：DS Full が最も効く組み合わせ。初期から `design-system/` を整備
- **新規案件 × M1（LP短納期等）**：DS Off が現実的。構築コスト回避を優先
- **既存改修 × M3**：Figma DS を「参照資料」として扱うに留め、実装は既存 SCSS 命名を踏襲（32 の 8-6 / 68 の Phase 0 準拠）