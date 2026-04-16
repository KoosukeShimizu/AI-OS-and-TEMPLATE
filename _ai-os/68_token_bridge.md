# 68_token_bridge.md

## 参照タイミング
既存の SCSS トークン（`_foundation/_config.scss` / `_tokens.scss`）と Figma Theme トークン（60系）が同一プロジェクトに共存しうる場合に参照する。

## このファイルについて
**このファイルは「新旧トークンの橋渡し規約」である（役割分類：60番台）。**
Figma Theme（60系命名）を **正** とし、既存 SCSS トークンを段階的に Figma Theme 命名に統一するための方針・対応表・禁止事項を定義する。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。
> 特に 32 の「8-6. デザインシステム参照時ルール」を前提とする。

Updated: 2026-04-16

---

# 1. 基本方針（OS固定）

## 1-1. Figma Theme を正とする

命名体系が衝突した場合、**Figma Theme（60系命名）を正**とする。
旧 SCSS トークン（`--bg-base`, `--text-default`, `--radius-base` 等）は段階的に Figma Theme 命名へ移行する。

理由：
- デザインの源泉を Figma に一本化することで、デザイナー・AI・実装の共通言語が揃う
- Figma Variables / Styles は L/D / PC/SP のモードを持ち、CSS 変数と変換が直結する
- 旧 SCSS の命名は歴史的経緯で語彙が不揃いになっている（`--bg-base` / `--bg-alt` / `--bg-deep`）

## 1-2. Figma Theme に無いものは旧 SCSS で継続管理

以下は Figma DS の責務範囲外なので、従来通り `_config.scss` / `_tokens.scss` 側で管理する：

| カテゴリ | 管理場所 | 理由 |
|---------|---------|------|
| ボタン派生（`--btn-primary`, `--btn-on-primary` 等） | SCSS | 実装寄りの派生、Figma では Component で表現 |
| SNS ブランドカラー（`--sns-facebook` 等） | SCSS | 外部仕様固定、DS の抽象化対象外 |
| z-index スケール（`$z-modal` 等） | SCSS | 実装レイヤー専用、デザイン非関与 |
| easing（`$ease-standard` 等） | SCSS | アニメーション実装側の関心事 |
| aspect ratio（`$aspect-video` 等） | SCSS | CSS プリミティブ、DS の抽象化対象外 |
| breakpoint（`$mb`, `$sp`, `$tab` 等） | SCSS | mixin 連動、`62_figma_mode_handling.md` と整合させる |

※ Figma DS 側で扱うのは「色 / spacing / radius / shadow / typography / state opacity / content string」の7カテゴリに限定する。

---

# 2. 命名対応表（新 = Figma Theme を正）

## 2-1. Brand / Accent

| 旧 SCSS | 新 Figma Theme | 備考 |
|---------|---------------|------|
| `--primary` | `--primary` | ✅ 一致、そのまま |
| `--secondary` | `--secondary` | 用途に応じて Figma 側に定義 |
| `--tertiary` | （廃止候補） | Figma 側で必要なら再定義 |
| `--accent` | （廃止候補） | primary/secondary で代替 |

## 2-2. Background

| 旧 SCSS | 新 Figma Theme |
|---------|---------------|
| `--bg-base` | `--bg-default` |
| `--bg-alt` | `--bg-raised` |
| `--bg-deep` | `--bg-header` or `--bg-footer`（用途で分岐） |
| `--bg-quaternary` | （用途再定義、Figma Theme に該当追加） |
| `--overlay` | `--bg-overlay` |
| `--surface-float` | `--bg-raised` + alpha、または Figma 側で専用定義 |

## 2-3. Text

| 旧 SCSS | 新 Figma Theme |
|---------|---------------|
| `--text-default` | `--text-main` |
| `--text-muted` | `--text-sub` |
| `--text-subtle` | `--text-caption` |
| `--text-light` | `--on-primary` or `--text-inverse` |
| `--text-dark` | `--text-main`（Dark mode で自動解決） |
| `--text-lead` | `text-lead`（Text Style 側で管理、`61_figma_styles.md`） |

## 2-4. Border

| 旧 SCSS | 新 Figma Theme |
|---------|---------------|
| `--border-dark` | `--border-default` |
| `--border-light` | `--border-inverse` |

## 2-5. Radius

| 旧 SCSS | 新 Figma Theme |
|---------|---------------|
| `--radius-base` / `--radius-xs` | `--rad-xs` |
| `--radius-s` | `--rad-s` |
| `--radius-m` | `--rad-m` |
| `--radius-l` | `--rad-l` |
| `--radius-xl` | `--rad-xl` |
| `$radius-full` | `--rad-full` |

※ Figma Theme は `rad-` prefix（60系規約）。旧 `--radius-` は廃止。

## 2-6. Shadow

| 旧 SCSS | 新 Figma Theme（Style） |
|---------|---------------|
| `--shadow-xs`〜`--shadow-xl` | `.shadow-xs`〜`.shadow-xl`（Effect Style） |
| `$shadow-soft-*`（ふわっと系） | （廃止候補、Figma 側で必要なら Effect Style 追加） |

※ Shadow は CSS 変数ではなく **Effect Style クラス** として出力される（`63_design_tokens_output.md`）。

## 2-7. Spacing（旧 SCSS に該当なし、Figma 新規）

| 新 Figma Theme | 備考 |
|---------------|------|
| `--gap-xxs`〜`--gap-xxl` | 要素間 / 内側 padding 共用 |
| `--section-s`〜`--section-xl` | セクション上下余白専用 |
| `--w-cont-*` | コンテナ幅（旧 `--main-max` を包含） |

## 2-8. Typography（Text Style 側で管理）

| 旧 SCSS | 新 Figma |
|---------|---------|
| `$fz-h1`〜`$fz-h6` | `.heading-h1`〜`.heading-h4`（Text Style） |
| `$fz-lead` / `$fz-base` / `$fz-s` / `$fz-xs` | `.text-lead` / `.text-main` / `.text-sub` / `.text-caption` |
| `$fz-section-title` / `$fz-page-title` 等 | `.heading-h*` に集約、固有名称は廃止 |

※ Typography は複合レシピとして Text Style で管理（`61_figma_styles.md`）。

---

# 3. 移行フェーズ

## Phase 0（現状の区別）

- **新規案件**：初期から `design-system/` を同梱し、Figma Theme 命名で出力する
- **既存改修案件**：旧 SCSS 命名のまま踏襲する（32 の 8-6 参照）
- 混在は許容するが、1 プロジェクト内での**新旧混在は禁止**

## Phase 1（新規案件の Figma 駆動化）

- `_template/site/` / `_template/lp/` の `_tokens.scss` を Figma Theme 命名に書き換える
- `tokens.json` → Style Dictionary → `_tokens.scss` の自動生成パイプラインを整備
- 既存テンプレの旧命名は「互換レイヤー」として一時的に残すか、`decisions.md` に記録して完全移行する

## Phase 2（既存案件の段階移行）

- 改修が発生したタイミングで部分的に新命名へ置換
- 全面 rename は原則行わない（32 の 7 破壊的変更禁止）
- 移行判断は `ai-runtime/ai_decision_log.md` に記録

---

# 4. AI 出力時の判断フロー

実装時、色・spacing 等を書こうとした際の判断順：

1. プロジェクトに `design-system/` があるか？
   - YES → **Figma Theme 命名**（`--bg-default`, `--gap-m` 等）で出力
   - NO → 旧 SCSS 命名（`--bg-base`, `$fz-base` 等）を踏襲
2. Figma Theme に該当トークンがない場合：
   - ボタン / SNS / z-index / easing / aspect / breakpoint → 旧 SCSS 側で継続管理（1-2 の表）
   - それ以外 → **生値禁止**。`ai_context.md` に未確定事項として記録、または `decisions.md` でトークン追加判断
3. 新旧命名が衝突した場合：
   - `design-system/decisions.md` に対応表を記録してから実装

---

# 5. 禁止事項

- 新旧命名の**1プロジェクト内混在**（`--bg-default` と `--bg-base` が共存する状態）
- AI の推測による rename（必ず `decisions.md` 経由）
- Figma Theme にない値を SCSS 側で独自に semantic 定義し直す（二重管理）
- `_tokens.scss` を Figma Theme 命名に置換する際、旧案件の `_project/` に残る旧変数参照を壊す（差分運用で段階移行）

---

# 6. 関連ドキュメント

- `32_generation_rules.md` — 8-6. デザインシステム参照時ルール（SSOT）
- `60_figma_variables.md` — Figma Theme 命名規約
- `61_figma_styles.md` — Text / Effect Style の命名
- `63_design_tokens_output.md` — トークン出力仕様と leaf ルール
- `67_design_system_workflow.md` — DS 制作 4 ステップ
- `41_style_scss.md` — 既存 SCSS 設計思想（旧命名の出典）
