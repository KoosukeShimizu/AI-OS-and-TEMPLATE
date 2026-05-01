# HANDOFF.md — セッション引き継ぎ文書

このファイルは「初回セッションから現在まで」の全判断・経緯を記録した引き継ぎ文書です。
新しいセッションを開始するときは、このファイルを読んでから作業を始めてください。

---

## このリポジトリの目的

`AIコーディングエージェント` リポジトリは **AI-OS フレームワーク**の管理リポジトリです。
「Figma でデザイン → AI がトークン変換 → コーディング」を自走できる配管（パイプライン）を整備することが主目的です。

対象プロジェクト：NOBIII（NDS_v2 = NOBIII Design System v2）をはじめとする Web 制作案件。

---

## 構築の経緯（時系列）

### Phase 1：Figma 連携モジュールの追加（60〜68番台）

**背景**：既存の AI-OS（00〜54番台）には Figma と SCSS の間をつなぐルールがなく、AIがトークン命名の正しさを判断できない状態だった。

**追加したもの**：

| ファイル | 内容 | 主な決定事項 |
|---|---|---|
| `60_figma_variables.md` | Variable Collection 構造・命名規約 | Config 層（プリミティブ）と Theme 層（セマンティック）の2層分離 |
| `61_figma_styles.md` | Text/Effect Style 規約 | Text 10種・Effect 11種の詳細定義、unit保持検証手順 |
| `62_figma_mode_handling.md` | L/D・PC/SP 4モード処理 | FOUC対策の preflight `<script>` 実装例を追加 |
| `63_design_tokens_output.md` | tokens.json → SCSS 変換仕様 | AI変換方式（Node/Style Dictionary 不使用）を採用 |
| `64_figma_migration.md` | プロジェクト間移植フロー | 移植後検証チェックリスト追加 |
| `65_figma_constraints.md` | Figma API 既知制約 | lineHeight/Shadow/非同期API/BLUR系など8制約を文書化 |
| `66_figma_guide_structure.md` | Style Guide 設計テンプレート | 被覆チェックリスト・Plugin API スクリプト雛形追加 |
| `67_design_system_workflow.md` | DS 制作4ステップ | Config → Theme → Style → Guide の順序を規定 |
| `68_token_bridge.md` | 新旧トークン命名対応表 | NDS_v2 実装と完全整合（2ラウンドのレビュー経て確定） |

---

### Phase 2：テンプレートへの design-system/ 追加

`_template/site/` と `_template/lp/` に `design-system/` ディレクトリ構造を追加。
新規プロジェクト開始時から DS 駆動で動ける雛形を整備。

追加ファイル：
- `design-system/decisions.md` — DS設計判断の記録先
- `design-system/tokens/HOWTO.md` — AI変換方式の手順書
- `CLAUDE.md` — プロジェクト起動時の読み込み順定義

---

### Phase 3：NDS_v2 との整合レビュー（2ラウンド）

NDS プロジェクトの AI に `68_token_bridge.md` をレビューさせた結果、以下の3箇所の乖離を発見・修正：

**乖離①：`68_token_bridge.md` §2-7 のWidth誤記**
- 誤：`--w-cont-narrow` / `--w-cont-wide`（NDS_v2 に存在しない）
- 正：`--w-cont-post` / `--w-cont-form` / `--w-cont-dialog` / `--w-sidebar`

**乖離②：`68_token_bridge.md` §2-3 text-caption の型混同**
- 誤：`--text-subtle → --text-caption`（text-caption は色Variable ではなくText Style）
- 正：`--text-subtle → --text-sub`

**乖離③：§2-3 欠落トークン**
- NDS_v2 実在の `--text-link` / `--text-placeholder` / `--text-disabled` が未記載
- → 追記済み

---

### Phase 4：判断分岐点と選択結果

セッション中に複数の設計方針の岐路があり、以下の選択をした：

**Q1：新旧SCSS命名の方針**
- 選択：**A（Figma Theme 命名を正とする）**
- 理由：まだ実案件での本格稼働前のため、旧SCSS命名（`--bg-base`等）を捨てて Figma Theme 命名（`--bg-default`等）に統一するコストが低いと判断
- 影響：`68_token_bridge.md` の対応表・移行フェーズ（Phase 0/1/2）に反映済み

**Q2：トークン変換方式**
- 選択：**B（AI変換方式 / Node・Style Dictionary 不使用）**
- 理由：テンプレが Prepros ベースで Node 環境を必須にしていない。Claude Code 前提なら AI 変換が現実的
- 影響：`63_design_tokens_output.md` と `HOWTO.md` に AI 変換手順として記載済み

**secondary-tint の追加（NDS側対応）**
- 選択：**A2（Figma 側にも追加）**
- 結果：NDS_v2 で実装完了。値は `indigo-50`（Light）/ `indigo-950`（Dark）
- `primary-tint` と対称化（2026-04-16 実装）
- `68_token_bridge.md` §2-1 と `decisions.md` に記録済み

---

### Phase 5：OS自己学習ルールの整備（このセッション）

AI-OS を使い続ける中でルールを育てるための仕組みを追加。

**追加した仕組み：**

1. **`_ai-os/03_os_inbox.md`**（新規）
   - OS候補・矛盾のステージングエリア
   - 直接OS更新は禁止。必ずここを経由する

2. **CLAUDE.md に自己学習ルール追加**
   - `[OS候補]`：AI-OS に未定義の判断をしたとき応答末尾にフラグ
   - `[OS矛盾]`：既存ルール間の衝突を検知したときフラグ
   - どちらも「インボックスに追加しますか？」と提案（自律的にマージしない）

3. **Stop フック**（`.claude/settings.json`）
   - セッション終了時に「OS候補があればインボックスに追加しますか？」をリマインド

4. **`_ai-os/69_figma_design_with_nds.md`**（新規）
   - NDS_v2 のトークンを使って Figma デザインを生成するときのルールセット
   - Surface/Text/Brand/Gap/Radius/Typography の選択ルール一覧
   - use_figma MCP の2パターン（同一ファイル内 vs ライブラリ参照）を明記

---

## 現在の状態サマリー

### 完成・安定しているもの

- `60〜68` 番台：Figma DS 連携規約（NDS_v2 と整合済み）
- `CLAUDE.md`（ルート）：自動読み込み設定済み
- `03_os_inbox.md`：OS自己学習の受け皿（空の状態）
- `68_token_bridge.md`：NDS_v2 実装と100%整合（2026-05-01 時点）

### 進行中・TODO

- `69_figma_design_with_nds.md` §9：NDS_v2 に UI コンポーネント（Button/Card/Input等）が未作成のため、コンポーネントカタログ・バリアント選択ルール・HTML変換パターンは TODO
- テンプレートプロジェクトへの適用：`_template/site/` と `_template/lp/` に雛形はあるが、実案件での初回稼働はまだ

---

## 絶対に忘れてはいけない決定事項

1. **Figma Theme 命名を正とする**：`--bg-default` が正、`--bg-base` は旧命名（廃止方向）
2. **インボックス方式**：OS候補を見つけても直接ファイルを更新しない。`03_os_inbox.md` に追記してユーザーに確認
3. **正式 OS アップデートはユーザーの明示依頼のみ**：「インボックスに追加」≠「OS更新」
4. **AI変換方式**：tokens.json → `_theme.scss` は Claude Code が変換する（Node 不要）
5. **差分更新ルール**：`_theme.scss` の2回目以降は丸ごと上書き禁止、diff 方式
6. **secondary-tint は実装済み**：`indigo-50`（Light）/ `indigo-950`（Dark）でNDS_v2に存在する

---

## 参照関係（このリポジトリ固有）

```
CLAUDE.md（自動読み込み）
    ↓
_ai-os/00_start.md（エントリーポイント）
    ↓ 条件付きで
_ai-os/60〜69（Figma DS 連携規約）
_ai-os/03_os_inbox.md（OS更新インボックス）
    ↓ 実案件では
_template/site/ or _template/lp/（雛形展開先）
    ↓
design-system/decisions.md（プロジェクト固有の判断記録）
```

---

## このファイルの更新ルール

- 大きな判断・方針変更があったときに追記する
- 「絶対に忘れてはいけない決定事項」セクションは常に最新状態を保つ
- 細かい実装変更はここに書かず、各 `_ai-os/XX.md` 側に記録する
