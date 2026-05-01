# Design System 意思決定ログ

このファイルにはプロジェクトの DS 設計で採用した重要な選択と、その理由を記録する。
「なぜこうなっているか？」を将来の自分・チーム・AI が理解できるようにするため。

## このファイルの責務境界

| 記録先 | 扱う内容 |
|-------|---------|
| **`design-system/decisions.md`**（このファイル） | Figma DS の設計・命名・トークン構造に関する判断（Config/Theme 層の分割、命名衝突の対応表、`_Reserved/` 退避の理由 等） |
| **`ai-runtime/ai_decision_log.md`** | 実装・プロジェクト運用の判断（ライブラリ導入、Mode 変更、include 構造の例外、テンプレ改修 等） |

**同じ変更が両方に跨る場合**（例：DS リネームに伴う実装側の一括置換）：
- 原因・設計判断 → 本ファイル
- 実装時の差分範囲・影響ファイル → `ai_decision_log.md`
- 相互に「関連：XX 参照」で記録する

## フォーマット

各決定は以下の形式で記録：

```md
## YYYY-MM-DD - {決定の短いタイトル}

### 決定内容
{何を決めたか}

### 理由
{なぜそう決めたか。却下した選択肢と却下理由も含む}

### 影響範囲
{この決定が影響する箇所}

### 関連
{参照すべき `_ai-os/` ドキュメントや Figma ノードID}
```

---

## 記録例

## 2026-04-16 - Config 層を picker 非表示化

### 決定内容
Config 層の全 Variable に `scopes = []` を設定し、Figma picker に表示されないようにした。
（例：`NDS_v2/Config/Color/`, `NDS_v2/Config/Spacing/` 等すべて）

### 理由
- デザイナー・AI が「Config/Spacing/_space-16」と「Theme/Spacing/Gap/gap-m」の両方を選べると迷う
- DS の意図は「Theme 層を使ってほしい」なので、Config は内部参照のみにしたい
- 却下：`hiddenFromPublishing=true` は API 不調で失敗する（`_ai-os/65_figma_constraints.md` 参照）

### 影響範囲
- Figma picker の挙動：Theme のみ表示
- コード変換：Config は出力対象外（直接参照しないため）
- Style Guide の binding は API 経由なので動作継続

### 関連
- `_ai-os/60_figma_variables.md` — Variable Collection の分離セクション
- `_ai-os/65_figma_constraints.md` — 制約3

---

## 2026-04-16 - Spacing を Gap / Section の2サブグループに分離

### 決定内容
旧 `gap-el-*` / `gap-sec-*` / `p-cont-*` の3系統を、`Gap/` と `Section/` の2サブグループに再編。

### 理由
- Gap（要素間）と Section（セクション上下余白）は値の質・ジャンプ率が違う
- picker で3系統混在は選びづらい（アルファベット順で混ざる）
- padding は将来 margin 追加時に衝突するので抽象化して Gap に統合
- 却下：inline/stack/inset 命名は数値特性が伝わりにくい

### 影響範囲
- Theme/06_Spacing 配下の全変数命名
- 参照している Style Guide / Component の再配線

### 関連
- `_ai-os/60_figma_variables.md` — カテゴリ prefix 一覧

---

<!-- 以下、実プロジェクトでの決定を追加 -->

# Design System 意思決定ログ — NDS_v2

このファイルは **NDS_v2 (NOBIII Design System v2)** の Figma 上での設計で採用した重要な選択と、その理由を記録する。
将来の自分・チーム・AI が「なぜこうなっているか？」を理解できるようにするため。

## プロジェクト情報

| 項目 | 値 |
|------|-----|
| デザインシステム名 | NDS_v2 |
| 開始日 | 2026-04 |
| Figma File Key | eZuOYxqc0RHxSkFQ0K6jWj |
| 準拠するフレームワーク | AI-OS v1.x (`_ai-os/60-67`) |

---

## アーキテクチャ決定

### 2026-04 - Config / Theme の2層構造を採用

#### 決定内容
Variables を **Config層（プリミティブ）** と **Theme層（セマンティック）** の2層で管理。
Theme は Config を alias 参照する形で構築。

```
Config/         ← 生の値（#f9fafb, 16px 等）
  Color/
  Spacing/
  ...
Theme/          ← 役割ベース
  01_Brand/
  02_Surface/
  ...（Config を alias）
```

#### 理由
- 単層設計だと「16px」という値をどこからも参照できて DRY 違反になる
- Theme 変更時に Config を触らずに済む（モード切替の柔軟性）
- 業界標準（Material, Radix UI, Figma推奨）に沿う
- 却下：フラット単層は小規模向けで、モード対応が破綻する

#### 影響範囲
- 全 Variable の構造
- コード変換時のレイヤー分離（Config は出力対象外）

#### 関連
- `_ai-os/60_figma_variables.md` — 命名規約
- `_ai-os/67_design_system_workflow.md` — 3層設計

---

### 2026-04 - Config 層を picker 非表示化（scope=[]）

#### 決定内容
Config 層の全 Variable に `scopes = []` を設定し、Figma picker に表示されないようにした。

#### 理由
- デザイナー・AI が Theme と Config の両方を選べると迷う
- DS の意図は「Theme 層を使ってほしい」なので、Config は内部参照のみにしたい
- 却下：`hiddenFromPublishing=true` は API 不調で失敗する

#### 影響範囲
- Figma picker の挙動：Theme のみ表示
- コード変換：Config は出力対象外（直接参照しないため）
- Style Guide の binding は API 経由なので動作継続

#### 関連
- `_ai-os/60_figma_variables.md` — Variable Collection の分離セクション
- `_ai-os/65_figma_constraints.md` — 制約3

---

### 2026-04 - NDS_v1 をバックアップとして保持

#### 決定内容
旧 Variable Collection `NDS_v1` を削除せず、全変数を `scopes = []` 化して picker 非表示のまま保持。

#### 理由
- 将来の参照・比較用にバックアップしておきたい
- picker に出ると選択肢が倍増してノイズになる
- 削除すると完全に失われる

#### 影響範囲
- NDS_v1 は picker 上は完全に見えないが、コレクションとして存在
- ファイルサイズはわずかに増えるが許容範囲

---

## カラーシステム

### 2026-04 - 20 hues × 11 shades + base の3層構成

#### 決定内容
Config/Color を以下の構造で定義：
- **base**: black / white / overlay（3変数）
- **20 hues**: gray, slate, stone, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, pink, rose, red, orange, amber
- **11 shades per hue**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- 値は **Tailwind CSS v3 準拠**

#### 理由
- Tailwind 準拠により、CSS変換時に既存ライブラリとの互換性が高い
- 20 hues で十分な表現力（neutrals 4 + spectrum 16）
- 50-950 の11段階は業界標準
- 却下：独自パレットは教育コスト高、移植性低い

#### 影響範囲
- 全 Theme Color 変数の alias 先
- Style Guide の A-1 セクション（グリッド表示）

---

### 2026-04 - Notice 色は 3 バリエーション構造

#### 決定内容
error / warning / success / info 各色を **default / sub / border** の3段階で定義。

- default: アクセント色（強いボタン等）
- sub: 淡い背景色（通知バナー背景）
- border: ボーダー色（アウトライン）

#### 理由
- notification UI で実装頻度が高い組み合わせ
- `-sub` + `-border` をペアで使うとフラットな通知デザインが完成する
- 却下：単色だけだと背景・枠線を別変数で用意する必要があり冗長

#### 影響範囲
- Theme/05_Notice 配下、全12変数（4色 × 3バリエーション）

---

### 2026-04-16 - Brand tint バリアントを primary / secondary 対称化（実装済み）

#### 決定内容
`Theme/01_Brand/secondary-tint` を追加（Light: **indigo-50**, Dark: **indigo-950**）。
`primary-tint`（blue-50 / blue-950）と同じ対称構造。

対称化後の Brand 全 10 トークン：

```
primary, primary-hover, primary-active, primary-disabled, primary-tint
secondary, secondary-hover, secondary-active, secondary-disabled, secondary-tint
```

#### 理由
- secondary ベースのボタン・ハイライト・通知で tint 色需要が予測される
- `primary-tint` のみ存在する非対称は将来の実装で不整合を招く
- AI-OS 側対応表（`_ai-os/68_token_bridge.md` §2-1）を綺麗に揃えるため
- 却下：`secondary-tint` を作らない（非対称のまま）→ 運用中に必ず問い合わせが発生する

#### 影響範囲
- Theme/01_Brand 配下、トークン数 9 → 10（実装完了）
- `_ai-os/68_token_bridge.md` §2-1 の備考欄に値を明記（indigo-50 / indigo-950）

#### 関連
- `_ai-os/68_token_bridge.md` §2-1 — Brand / Accent 対応表
- NDS レビュー指摘（2026-04-16）

---

## スペーシング

### 2026-04 - Gap / Section の2サブグループに分離

#### 決定内容
旧 `gap-el-*` / `gap-sec-*` / `p-cont-*` の3系統を、`Gap/` と `Section/` の2サブグループに再編。

- **Gap/**: 要素間・内側padding共用（4〜48px、7段階）
- **Section/**: セクション上下padding専用（40〜160px、4段階、大きめ限定）

#### 理由
- Gap（要素間）と Section（セクション余白）は値の質・ジャンプ率が違う
- picker で3系統混在は選びづらい（アルファベット順で混ざる）
- padding は将来 margin 追加時に衝突するので抽象化して Gap に統合
- 却下：inline/stack/inset 命名は数値特性が伝わりにくい

#### 影響範囲
- Theme/06_Spacing 配下の全変数命名

#### 関連
- `_ai-os/60_figma_variables.md` — カテゴリ prefix 一覧

---

### 2026-04 - Gap は xxs〜xxl の 7 段階、PC/SP で 1 段ずらし

#### 決定内容
Gap のスケールを Tシャツサイズ（xxs/xs/s/m/l/xl/xxl）で統一。値は PC/SP で 1 段階ずつずらす。

| トークン | PC値 | SP値 |
|----------|------|------|
| gap-xxs | 4 | 2 |
| gap-xs | 8 | 4 |
| gap-s | 12 | 8 |
| gap-m | 16 | 12 |
| gap-l | 24 | 16 |
| gap-xl | 32 | 24 |
| gap-xxl | 48 | 32 |

#### 理由
- 数字 suffix（2xl / 4xl 等）は値の対応関係が直感的でない
- t-shirt サイズは世界標準、学習コスト低
- PC/SP の値違いは「同じ意味合いで、SPは少し詰める」という運用パターンが普遍的
- 1段階ずらしにすることで、デザイナーの個別調整を最小化
- 却下：サイズごとに値を個別設定（手間が大幅増）

#### 影響範囲
- Theme/06_Spacing/Gap 配下

---

### 2026-04 - Section は s〜xl の 4 段階、大きめ限定

#### 決定内容
Section のスケール：section-s (40) / section-m (80) / section-l (120) / section-xl (160)

#### 理由
- セクション上下は「40px 未満」を使うことが稀
- 大きめ値だけに絞ることで、picker で選ぶ時に迷わない
- Gap と値域が重ならないため分類が明確
- 却下：Gap と統合した汎用スケール → 値域が広すぎて選びづらい

---

## レイアウト幅

### 2026-04 - Width は 260〜1920 の 14 値で網羅

#### 決定内容
Config/Width に以下14値を定義：260, 320, 360, 480, 520, 600, 640, 720, 768, 960, 1024, 1280, 1440, 1920

#### 理由
- 320 / 360 / 768 / 1024 / 1440 はブレークポイント境界として必須
- 640 / 720 はコンテンツ幅の定番
- 1920 は fullHD 対応
- 却下：少なすぎると実運用で「既存値と微妙にずれた」ケースが増える

#### 影響範囲
- Theme/07_Width の alias 先

---

## タイポグラフィ

### 2026-04 - FontSize に _fs-30 (Tailwind text-3xl) を追加

#### 決定内容
Config/FontSize に `_fs-30` (30px) を追加。28 と 32 の間を補完。

#### 理由
- Tailwind の `text-3xl` が 30px で、準拠するには必須
- 28 と 32 の差は 4px だが、見出しサイズとして両方使いたいケースがある
- 却下：追加しない → Tailwind との整合性が失われる

---

### 2026-04 - Typography 系は Variable ではなく Text Style で管理

#### 決定内容
- fontSize, fontWeight は Variable
- lineHeight, letterSpacing は Text Style 内で直接指定（Variable にしない）
- Heading, Body, UI の 10 Text Styles を作成

#### 理由
- Figma API の制約で lineHeight / letterSpacing を Variable bind すると unit が PIXELS に強制変換される
- Text Style は unit を保持できる（PERCENT, em）
- 複合的な定義（size + weight + lh + ls）は Style としてまとまっている方が運用しやすい
- 却下：すべてを Variable にする → Figma 上で挙動が破綻

#### 影響範囲
- `Theme/10_Typography/LineHeight` と `LetterSpacing` は `_Reserved/` 退避
- Text Style が実装上の参照先

#### 関連
- `_ai-os/61_figma_styles.md` — Style 内 Variable 参照
- `_ai-os/65_figma_constraints.md` — 制約1

---

### 2026-04 - Text Style leaf 名は text-* / heading-* で self-descriptive

#### 決定内容
Text Style の命名：
- Heading/heading-h1 〜 heading-h4
- Body/text-lead / text-main / text-sub / text-caption
- UI/text-button / text-label

#### 理由
- AI コード生成時に **階層を無視して leaf のみ** を使う運用方針のため、leaf 単独で意味が通る必要がある
- `h1` 単独だと HTML 要素と区別つかない → `heading-h1`
- `main` 単独だと HTML `<main>` と衝突 → `text-main`
- すべての Text Style が `text-*` or `heading-*` で始まるため CSS で `.text-*` ファミリーとして揃う
- 却下：`Body/lead` のような短い命名 → leaf 単独だと曖昧

#### 影響範囲
- CSS クラス名 / CSS 変数名の統一感
- AI のコード変換の単純化

---

## エフェクト

### 2026-04 - Effect を統合カテゴリ化（Config/Effect/）

#### 決定内容
Shadow 専用の `Config/Shadow/` を廃止し、`Config/Effect/` に統合：
- `Config/Effect/Blur/` — 汎用ブラー（Shadow blur + backdrop blur 共用）
- `Config/Effect/ShadowOffset/`
- `Config/Effect/ShadowSpread/`
- `Config/Effect/_Reserved/` — ShadowOpacity（Figma制約で退避）

#### 理由
- Blur は Shadow だけでなく backdrop-filter でも使う汎用値
- Shadow 専用グループは値の重複を招く
- サブグループで役割を明示することで整理度向上
- 却下：Shadow サブ, Blur サブを別グループ → 横断利用が難しい

---

### 2026-04 - Blur は 数値 suffix で統一

#### 決定内容
`_ef-blur-*` の suffix は数値（0, 2, 4, 8, 12, 16, 24, 32, 40, 56）で統一。
（旧：s/m/l/xl/xs/md/lg/2xl/3xl の混在）

#### 理由
- Config 層は値を直接扱う層なので、数値 suffix が最も明確
- 他の Config 変数（_space-*, _fs-*）と命名規則が揃う
- 却下：t-shirt サイズ → Config の他カテゴリと不揃い

#### 影響範囲
- Config/Effect/Blur/ 配下全変数
- Theme/09_Shadow から alias し直し

---

### 2026-04 - Effect Styles で Drop / Backdrop / Inner / Focus の4カテゴリ

#### 決定内容
Effect Styles を4カテゴリ 11種で構成：
- **Shadow/** （Drop Shadow） - shadow-xs, s, m, l, xl（5種）
- **Blur/** （Backdrop Blur） - blur-s (8), blur-m (24), blur-lg (56)（3種）
- **Inner/** - inner-input, inner-pressed（2種）
- **Focus/** - focus-ring（1種）

#### 理由
- 各カテゴリは CSS 上で別プロパティ（box-shadow / backdrop-filter / box-shadow inset / box-shadow spread）
- 混同を避けるため別グループ
- Focus Ring は Border と違い Effect として表現することで z-index・animation 対応しやすい
- 却下：全部 Shadow/ 配下 → 用途別の使い分けが伝わらない

---

### 2026-04 - Backdrop Blur は 8 / 24 / 56 の幅広3段階

#### 決定内容
Backdrop Blur のスケールを軽 / 中 / 強の3段階に広げる：
- blur-s: 8px（軽いすりガラス）
- blur-m: 24px（標準）
- blur-lg: 56px（劇的な透過）

#### 理由
- 元の 8 / 16 / 24 だと後半のジャンプが小さく、差分が認識しづらい
- 8 → 24 → 56 のジャンプ率 ×3, ×2.33 で段階差が明確
- backdrop-blur の典型的用途（ナビ透過、モーダル背景、ヒーロー背景）を3段でカバー
- 却下：より細かい4段階 → 選択肢過多、使い分け意図が薄れる

---

### 2026-04 - Focus Ring に border-focus 色を bind

#### 決定内容
Focus Ring Effect Style の color を `Theme/04_Border/border-focus` に Variable bind。

#### 理由
- フォーカスリングとボーダーはテーマ切替時に同じ色で動くべき
- 別定数にすると L/D 切替で不整合が起きる
- 却下：color をハードコード → テーマ切替破綻

---

## 運用ルール

### 2026-04 - _Reserved/ 退避ルールを採用

#### 決定内容
Figma API 制約で正しく動作しない Variable を削除せず `_Reserved/` サブグループに退避。`⚠_` prefix を付与。

現状退避されているもの：
- `Theme/10_Typography/LineHeight/⚠_lh-*` （PIXELS 強制変換）
- `Theme/10_Typography/LetterSpacing/⚠_ls-em-*` （同上）
- `Config/Effect/_Reserved/⚠__sd-opacity-*` （COLOR型 bind 不可）

#### 理由
- 将来 Figma API が改善されれば復活可能
- 削除すると歴史が失われる
- `⚠_` prefix で「使用不可」を視覚警告
- 却下：削除 → 情報ロス、復活時の再作成コスト高

#### 影響範囲
- Style Guide から除外（視覚化しない）
- コード変換対象外

#### 関連
- `_ai-os/65_figma_constraints.md` — 制約1, 2

---

### 2026-04 - Style Guide は視覚+被覆担保の二重役割

#### 決定内容
Style Guide を以下2目的で構築：
1. **視覚ドキュメント**（人間向け）
2. **全トークン bind 担保**（移植時の完全転送用）

全 Variable / Style は Guide 内でどこかに bind されている状態を維持。

#### 理由
- Figma の copy-paste は bind されているトークンのみ転送する
- Guide を作り込むことで、Guide ごとコピペ = 完全移植が成立
- 別途プラグインに依存せず移植可能
- 却下：視覚ドキュメント単体 → 移植時の取りこぼしリスク

#### 影響範囲
- Guide レイアウト設計（全カテゴリに触れる必要がある）
- B-12 Content の STRING 変数も characters bind

#### 関連
- `_ai-os/66_figma_guide_structure.md` — Guide 設計テンプレート

---

### 2026-04 - 移植フローを 2パターン併用

#### 決定内容
プロジェクト間の DS 移植は以下 2 パターンを併用：
1. **軽量移植**: Variables2JSON で tokens.json 経由（Variables のみ、Styles 転送されない）
2. **完全移植**: Style Guide をまるごとコピー&ペースト（Variables + Styles 両方）

#### 理由
- Variables のみで足りる軽量案件には 1、完全な DS 継承には 2 を使い分け
- 単一手法に絞ると柔軟性低下
- 却下：Team Library 購読 → プロジェクト独立運用が難しい

#### 関連
- `_ai-os/64_figma_migration.md` — 移植フロー詳細

---

## 将来の拡張候補（保留事項）

以下は現バージョンでは実装せず、必要になった時点で追加予定：

- **Grid Styles**: PC/SP 別レイアウトグリッド
- **Gradient Paint Styles**: ヒーローオーバーレイ等
- **Component-level Typography プリセット**: Button, Card 内のテキストスタイル組み合わせ
- **アクセントカラーファミリー**: Brand 以外の差別化色（例：promo, highlight）
- **Display Typography**: h1 より大きいヒーロー用（60px, 80px）
- **Motion トークン**: Duration, Easing（Figma 側の対応待ち）

---

## 次バージョン（NDS_v3）検討事項

- `NDS_v2` 運用で見えてきた追加/削除ニーズ
- Figma API の改善（lh/ls bind 対応）があれば `_Reserved/` 解除
- Design Tokens (W3C DTCG) 公式バインディング対応
