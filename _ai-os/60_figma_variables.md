# 60_figma_variables.md

## 参照タイミング
Figma Variables をコードトークンへ変換する場合に参照する（実装前の変換規約確認）。

## このファイルについて
**このファイルは「デザインシステム変換規約」である（役割分類：60番台）。**
Figma Variables の命名構造・カテゴリ prefix・除外ルール・コード変換ルールを定義する。
AI は Figma 連携プロジェクトで変数を扱う際、このファイルを必ず参照すること。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-16
---

# Figma Variables 運用規約

## 前提
- Figma のデザインシステムは **Config層（プリミティブ）** と **Theme層（セマンティック）** の2層構造で設計されている
- Variables は L/D・PC/SP のモードを持つ
- AI はこの規約に従って Figma 変数をコードトークンに変換する

## 命名構造

### 階層（Figma上の整理用）
```
Theme/NN_Category/SubGroup/leaf-name
例: Theme/06_Spacing/Gap/gap-m
    Theme/10_Typography/FontSize/fz-h1
```

- `NN_` の数字 prefix は Figma パネル内のソート順制御のみの役割
- **AI はこれらの階層情報を無視する**

### 末尾名（leaf）
- AI がコード生成時に使用するのは **leaf 名のみ**
- leaf 名は単体で意味が通る self-descriptive 形式で命名される

例:
- `Theme/01_Brand/primary` → CSS変数 `--primary`
- `Theme/02_Surface/bg-default` → CSS変数 `--bg-default`
- `Theme/06_Spacing/Gap/gap-m` → CSS変数 `--gap-m`
- `Theme/11_State/state-hover` → CSS変数 `--state-hover`

### カテゴリ prefix 一覧
| prefix | 意味 | 例 |
|--------|------|-----|
| `bg-` | 背景色 | bg-default, bg-raised |
| `text-` | テキスト色 | text-main, text-sub |
| `border-` | ボーダー色 | border-default, border-focus |
| `on-` | カラー背景上のテキスト色 | on-primary, on-notice |
| `gap-` | 要素間スペース | gap-xxs〜gap-xxl |
| `section-` | セクション上下余白 | section-s〜section-xl |
| `w-` | 幅 | w-cont-default, w-sidebar |
| `rad-` | 角丸半径 | rad-s, rad-full |
| `fz-` | フォントサイズ | fz-body-m, fz-h1 |
| `fw-` | フォントウェイト | fw-reg, fw-bold |
| `state-` | インタラクション不透明度 | state-hover, state-disabled |

## Variable Collection の分離

Figma では Variable Collection を複数持てる。過去バージョンをバックアップとして保持したい場合：

- 新コレクション（例：`NDS_v2`）で現行運用
- 旧コレクション（例：`NDS_v1`）は残したまま、全変数に `scopes = []` を適用して picker 非表示化
- 削除せず「バックアップ」として保持できる

複数バージョンの picker 共存を防ぐため、旧コレクションは scope 空化を徹底する。

## 除外ルール
- `_Reserved/` 配下の変数は **Figma API 制限により使用不可**。AI は無視すること。
- `⚠_` prefix が付いた変数も同様。

## コード生成時の変換ルール
- Variable名 `bg-default` → CSS `--bg-default` / Tailwind `bg-default` / TS `tokens.bgDefault`
- kebab-case を基本とし、言語側の慣習に応じて変換
- Figma階層（`Theme/`, `NN_`）は出力に含めない

## Config 層のピッカー非表示

Config 変数は Theme の内部参照専用。デザイナーやAIが直接選ぶことはない。
Figma上で Config 変数が picker に出現しないよう、`scopes = []`（空配列）を設定する。

- Theme 変数のみが picker に表示される
- Config の bind は API / 既存バインディング経由でのみ有効
- これにより「どのトークンを使うべきか」の迷いがなくなる

## STRING変数の扱い

`Theme/12_Content/` 配下の STRING変数（`dummy-*`, `meta-*`, `ph-*`）：
- テキスト内容のプレースホルダー・ダミー
- コード側では i18n キー or 環境変数として扱う
- leaf名そのまま key 化（例：`ph-input` → `placeholder.input`）

## _Reserved/ とは（除外ルールの根拠）

Figma API の制約で以下のプロパティは Variable バインド時に単位（unit）が強制変換される：
- `lineHeight` → PERCENT 指定で bind すると PIXELS に変わる
- `letterSpacing` → 同上
- `shadow opacity` → COLOR型しかバインド不可

これらは「使えない」のではなく「Figma上で値を持ってもバインド経由で正しく適用できない」。
将来 Figma 側で改善される可能性があるため削除せず `_Reserved/` に退避。
コード側では CSS `line-height: 1.4` / `letter-spacing: 0.02em` 等で直接指定する（実運用は `61_figma_styles.md` の Text Style を介する）。

---

## 関連ドキュメント

- `32_generation_rules.md` — 絶対ルール（SSOT）
- `61_figma_styles.md` — Styles の命名規約（Variables との使い分け）
- `62_figma_mode_handling.md` — L/D / PC/SP モードの変換方法
- `63_design_tokens_output.md` — トークンの各言語出力仕様
- `64_figma_migration.md` — プロジェクト間の移植フロー
- `65_figma_constraints.md` — Figma API の既知制約（lh/ls の _Reserved 退避理由はここ）
- `66_figma_guide_structure.md` — Style Guide 設計（Guide 内で Variable が bind されている理由）
- `67_design_system_workflow.md` — DS 制作4ステップワークフロー
