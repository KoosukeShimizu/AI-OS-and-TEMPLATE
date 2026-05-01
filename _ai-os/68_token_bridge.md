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

## 1-3. 責務境界の明示（重要）

**Figma DS の責務は「色値・寸法値・タイポ値のセマンティック」まで。**
コンポーネント状態の組み合わせ（ボタンの hover 挙動、アコーディオンの開閉トランジション等）は SCSS 側で組む。

たとえば Figma Theme に `--primary-hover` がある場合、それは「primary 色のホバー状態で使う色値」であって、「ボタンの hover 挙動を定義したスタイル」ではない：

- Figma 側：色の semantic 変数（primary-hover = #XXXXXX）
- SCSS 側：`button:hover { background: var(--primary-hover); transition: ...; }`

AI は Figma に `-hover` / `-active` / `-disabled` 等の変数があっても、コンポーネントスタイル自体まで Figma に求めないこと。

---

# 2. 命名対応表（新 = Figma Theme を正）

本表は NDS_v2 実装を基準とする。**旧 SCSS に該当がない（Figma 新規）トークンも全て列挙**し、AI 変換時の「未記載によるスタック」を防ぐ。
新トークンは CSS Custom Properties として出力される（`63_design_tokens_output.md` 準拠、kebab-case）。

## 2-1. Brand / Accent（01_Brand）

| 旧 SCSS | 新 Figma Theme | 備考 |
|---------|---------------|------|
| `--primary` | `--primary` | ✅ 一致 |
| （該当なし） | `--primary-hover` | hover 時の色値（挙動定義は SCSS 側、1-3 参照） |
| （該当なし） | `--primary-active` | active/pressed 時の色値 |
| （該当なし） | `--primary-disabled` | 無効化時の色値 |
| （該当なし） | `--primary-tint` | primary の淡色バリアント |
| `--secondary` | `--secondary` | ✅ 一致 |
| （該当なし） | `--secondary-hover` | |
| （該当なし） | `--secondary-active` | |
| （該当なし） | `--secondary-disabled` | |
| （該当なし） | `--secondary-tint` | indigo-50 (L) / indigo-950 (D)、primary-tint と対称（2026-04-16 実装） |
| `--tertiary` | （廃止候補） | NDS_v2 には存在しない |
| `--accent` | （廃止候補） | primary/secondary で代替 |

## 2-2. Surface / Background（02_Surface）

| 旧 SCSS | 新 Figma Theme | 備考 |
|---------|---------------|------|
| `--bg-base` | `--bg-default` | 標準背景 |
| `--bg-alt` | `--bg-raised` | 一段持ち上げ面 |
| `--bg-deep` | `--bg-deep` | ✅ NDS_v2 に実在。深い背景用、そのまま踏襲 |
| `--bg-quaternary` | （用途再定義） | NDS_v2 に直接対応なし。decisions.md で判断 |
| `--overlay` | `--bg-overlay` | 暗幕 |
| `--surface-float` | `--bg-raised` + alpha 等 | 用途次第、decisions.md で明記 |
| （該当なし） | `--bg-surface` | カード面 |
| （該当なし） | `--bg-side` | サイドバー/脇面 |
| （該当なし） | `--bg-hover` | hover 時の面色 |
| （該当なし） | `--bg-selected` | 選択状態の面色 |
| （該当なし） | `--bg-inverse` | 反転面（暗色地） |
| （該当なし） | `--bg-header` | ヘッダー専用 |
| （該当なし） | `--bg-footer` | フッター専用 |

## 2-3. Text（03_Text）

| 旧 SCSS | 新 Figma Theme | 備考 |
|---------|---------------|------|
| `--text-default` | `--text-main` | 主要テキスト |
| `--text-muted` | `--text-muted` | ✅ NDS_v2 に実在、そのまま踏襲（sub とは役割違い） |
| （該当なし） | `--text-sub` | 補助テキスト（muted より目立つ階層） |
| `--text-subtle` | `--text-sub` | subtle は sub に寄せる |
| `--text-light` | `--text-inverse` | 反転テキスト |
| `--text-dark` | `--text-main` | Dark mode で自動解決、独立変数は廃止 |
| `--text-lead` | `.text-lead`（Text Style） | Style 側で管理、`61_figma_styles.md` |
| `$c-link-default`（近似） | `--text-link` | リンクテキスト色 |
| （該当なし） | `--text-placeholder` | input プレースホルダー色 |
| （該当なし） | `--text-disabled` | 無効化テキスト色 |
| （該当なし） | `--on-primary` | primary 背景上のテキスト色 |
| （該当なし） | `--on-secondary` | secondary 背景上のテキスト色 |
| （該当なし） | `--on-notice` | notice 背景上のテキスト色 |

※ `--text-caption` という **色 Variable は存在しない**。`.text-caption` は Text Style（Body/text-caption）であり、fontSize は Variable `fz-caption` に分離される。NDS 側指摘の誤マッピング修正済み。

## 2-4. Border（04_Border）

| 旧 SCSS | 新 Figma Theme | 備考 |
|---------|---------------|------|
| `--border-dark` | `--border-default` | 標準ボーダー |
| `--border-light` | `--border-inverse` | 反転（暗地）ボーダー |
| （該当なし） | `--border-subtle` | 控えめなボーダー |
| （該当なし） | `--border-strong` | 強調ボーダー |
| （該当なし） | `--border-focus` | focus リング色 |
| （該当なし） | `--border-disabled` | 無効化時 |

## 2-5. Notice（05_Notice、全12トークン）

| 旧 SCSS | 新 Figma Theme |
|---------|---------------|
| `$c-danger-default` | `--error-default` |
| `$c-danger-lighten`（近似） | `--error-sub` |
| （該当なし） | `--error-border` |
| `$c-important-default` | `--warning-default` |
| `$c-important-lighten` | `--warning-sub` |
| （該当なし） | `--warning-border` |
| `$c-success-default` | `--success-default` |
| `$c-success-lighten` | `--success-sub` |
| （該当なし） | `--success-border` |
| `$c-info-default` | `--info-default` |
| `$c-info-lighten` | `--info-sub` |
| （該当なし） | `--info-border` |

※ 旧 SCSS の `-light` / `-dark` / `-darken` は default に統合、残りは廃止候補。

## 2-6. Spacing（06_Spacing、旧 SCSS に該当なし）

| 新 Figma Theme | 備考 |
|---------------|------|
| `--gap-xxs`〜`--gap-xxl` | Gap サブグループ、要素間 / 内側 padding 共用（PC/SP で 1段ずらし） |
| `--section-s`〜`--section-xl` | Section サブグループ、セクション上下余白専用 |

## 2-7. Width（07_Width、旧 SCSS に該当なし）

| 旧 SCSS | 新 Figma Theme | 備考 |
|---------|---------------|------|
| `--main-max` | `--w-cont-default` | ページ標準幅 |
| （該当なし） | `--w-cont-post` | 記事・ポスト幅 |
| （該当なし） | `--w-cont-form` | フォーム最大幅 |
| （該当なし） | `--w-cont-dialog` | ダイアログ・モーダル幅 |
| （該当なし） | `--w-sidebar` | サイドバー幅 |

## 2-8. Radius（08_Radius）

| 旧 SCSS | 新 Figma Theme | 備考 |
|---------|---------------|------|
| `$radius-none` / `--radius-base` | `--rad-none` | 0px |
| `--radius-xs` | `--rad-xs` | |
| `--radius-s` | `--rad-s` | |
| `--radius-m` | `--rad-m` | |
| `--radius-l` | `--rad-l` | |
| `--radius-xl` | `--rad-xl` | |
| `$radius-full` | `--rad-full` | 9999px |

※ 旧 `--radius-base` は `--rad-none` 相当（0px）か `--rad-xs` 相当かはプロジェクトで判断し `decisions.md` に記録する。

## 2-9. Shadow（09_Shadow、Effect Style 側で管理）

| 旧 SCSS | 新 Figma |
|---------|---------|
| `--shadow-xs`〜`--shadow-xl` | `.shadow-xs`〜`.shadow-xl`（Effect Style クラス） |
| `$shadow-soft-*` | 廃止候補、必要なら Figma 側で Effect Style 追加 |

※ Shadow は CSS 変数ではなく **Effect Style クラス** として出力（`63_design_tokens_output.md`）。

## 2-10. Typography Variables（10_Typography、Variable 部分）

| 旧 SCSS | 新 Figma Theme（Variable） |
|---------|---------------|
| `$fz-xs` | `--fz-caption`（11px 相当） |
| `$fz-s` / `$fz-base` | `--fz-body-s` / `--fz-body-m` |
| `$fz-lead` / `$fz-l` / `$fz-xl` | `--fz-body-l` |
| `$fz-h1`〜`$fz-h6` | `--fz-h1` / `--fz-h2` / `--fz-h3` / `--fz-h4` |
| （該当なし） | `--fw-reg` / `--fw-med` / `--fw-bold` |

※ fontSize / fontWeight は Variable、lineHeight / letterSpacing は Text Style 側で直接指定（`_Reserved/` 退避、`65_figma_constraints.md` 制約1）。

## 2-11. Typography Styles（Text Style、全10種）

| 旧 SCSS（$fz-系） | 新 Figma Text Style |
|---------|---------|
| `$fz-h1`〜`$fz-h4` ベースのスタイル | `.heading-h1`〜`.heading-h4` |
| `$fz-lead` ベース | `.text-lead` |
| `$fz-base` ベース | `.text-main` |
| `$fz-s` ベース | `.text-sub` |
| `$fz-xs` ベース | `.text-caption` |
| `$fz-section-title` / `$fz-page-title` 等の固有名 | `.heading-h*` に集約、固有名称は廃止 |
| （ボタン専用） | `.text-button` |
| （ラベル専用） | `.text-label` |

## 2-12. State（11_State、全5トークン）

| 旧 SCSS | 新 Figma Theme |
|---------|---------------|
| （該当なし） | `--state-disabled` |
| （該当なし） | `--state-hover` |
| （該当なし） | `--state-pressed` |
| （該当なし） | `--state-focus` |
| （該当なし） | `--state-skeleton` |

※ 全て FLOAT（opacity 値）。`color-mix()` や `rgba()` と組み合わせて使用。

## 2-13. Content（12_Content、STRING 変数）

| 新 Figma Theme | 備考 |
|---------------|------|
| `dummy-*` | ダミーテキスト |
| `meta-*` | メタ情報文字列 |
| `ph-*` | プレースホルダー |

※ コード側では i18n キー or 環境変数として扱う（`60_figma_variables.md` STRING 変数節）。

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
