# 67_design_system_workflow.md

## 参照タイミング
デザインシステムを新規作成または改修する時に参照する。

## このファイルについて
**このファイルは「DS制作ワークフロー」である（役割分類：60番台）。**
Figma 上でデザインシステムを構築・維持するための標準プロセスを定義。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-16

---

## 基本原則：3層設計

```
Config層（プリミティブ）
  ↓ alias
Theme層（セマンティック）
  ↓ 参照
Style層（レシピ）
  ↓ 適用
Component / Design
```

- **Config**: 生の値（#f3f4f6, 16px, 400 等）。デザイナー/AIから直接選ばせない
- **Theme**: 役割ベースの命名（bg-default, gap-m, text-main 等）。L/D・PC/SPモード切替を担う
- **Style**: 複合レシピ（Heading/h1 = fontSize + weight + lineHeight + letterSpacing）

---

## 制作フロー（4ステップ）

### Step 1: Config 層のプリミティブ定義

**目的**：生の値を網羅的に揃える

**やること**：
1. **Color**: Tailwind v3 準拠 20 hues × 11 shades（50, 100, ..., 950）+ base（black/white/overlay）
2. **Spacing**: 2〜320px の段階的スケール（1.5〜2倍ジャンプ）
3. **Width**: レイアウト幅（260〜1920px、ブレークポイント含む）
4. **Radius**: 0, 2, 4, 8, 12, 16, 24, 32, 9999（full）
5. **FontSize**: 10〜80px の段階スケール
6. **FontWeight**: 100〜900
7. **Opacity**: 0〜100（4刻みで 16段階程度）
8. **Effect**: Blur, Shadow Offset / Spread

**ルール**：
- scopes=[] で picker 非表示化（Theme経由でのみ使用）
- 命名は `_` prefix で「内部用」を示す（`_space-16` 等）
- サブグループで整理（`Effect/Blur/`, `Effect/ShadowOffset/` 等）

---

### Step 2: Theme 層のセマンティック命名

**目的**：役割ベースのトークンを定義し、L/D・PC/SP モードを持たせる

**やること**：
1. **01_Brand**: primary 系 + secondary 系（各4バリエーション）
2. **02_Surface**: bg-* 系（default, raised, header, footer, hover, overlay 等）
3. **03_Text**: text-* 系 + on-* 系
4. **04_Border**: border-* 系
5. **05_Notice**: error/warning/success/info × default/sub/border
6. **06_Spacing**: Gap / Section サブグループ
7. **07_Width**: w-cont-* 系
8. **08_Radius**: rad-*
9. **09_Shadow**: sd-* 系（注：opacity は Figma 制約で Style 側）
10. **10_Typography**: FontSize / Weight サブグループ（lh, ls は `_Reserved/` 退避）
11. **11_State**: state-* 系（disabled, hover, pressed, focus, skeleton）
12. **12_Content**: meta-*, ph-*, dummy-* STRING 変数

**ルール**：
- **leaf 名は self-descriptive**（`hover` ではなく `state-hover`）
- **prefix をつけて重複回避**（`primary` は Brand に1つ、他カテゴリでは prefix 付き）
- **Config への alias** で値を参照
- **PC/SP で値を変える変数** は明示（gap-*, section-* 等）
- **Figma bind 不可のもの** は `_Reserved/` に移動し `⚠_` prefix

---

### Step 3: Style 層のレシピ構築

**目的**：複合的な定義を Style として束ねる

**やること**：
1. **Text Styles**（10種目安）
   - Heading/heading-h1〜h4
   - Body/text-lead, text-main, text-sub, text-caption
   - UI/text-button, text-label
   - 内部で fontSize / fontWeight を Theme Variable 参照
   - lineHeight / letterSpacing は PERCENT・em を直接指定

2. **Effect Styles**
   - Shadow/shadow-xs〜xl（Drop Shadow、段階的）
   - Blur/blur-s〜lg（Backdrop Blur、3段階）
   - Inner/inner-input, inner-pressed
   - Focus/focus-ring

**ルール**：
- Group は PascalCase、leaf は kebab-case で self-descriptive
- 例: `Shadow/shadow-xs`（leaf 単独でも意味が通る）

---

### Step 4: Style Guide 作成

**目的**：視覚ドキュメント + 移植時の全トークン転送担保

**やること**：
1. **Config ガイド作成**（A-1 〜 A-n）
   - 各 Config カテゴリをセクション化
   - 全 Config 変数を bind で表現
2. **Theme ガイド作成**（B-1 〜 B-n）
   - 各 Theme カテゴリをセクション化
   - L/D モード差が視覚で分かるレイアウト
   - Text Styles / Effect Styles を実適用
3. **被覆チェック**（`66_figma_guide_structure.md` 参照）

---

## 反復プロセス

初期版を作ったら以下のサイクルで洗練：

```
命名検討 → 実装 → 可視化（ガイドで見る）→ 違和感を発見 → リネーム → 再実装
```

### よくある反復パターン
- 「`gap-el-*` と `gap-sec-*` が picker で混ざって選びづらい」→ `Gap/` と `Section/` サブグループに分離
- 「`body-main` より `text-main` の方が CSS に馴染む」→ Style leaf のリネーム
- 「Radius 縦長で見づらい」→ 横並びレイアウトに変更
- 「picker に Config が出て邪魔」→ scopes=[] で非表示化

---

## 運用上のアンチパターン回避

### やってはいけないこと
- ❌ Config を直接 Design に bind する（Theme 層を飛ばす）
- ❌ Variable 名の頭に言語固有の記号（`@`, `$` 等）
- ❌ 日本語を leaf 名に使う（picker 検索・コード変換が壊れる）
- ❌ 数字のみの leaf（`100`, `50` 単独 → 何を示すか不明）
- ❌ Style の leaf を `h1`, `sm` など単独（グループ名に依存しないと曖昧）

### やるべきこと
- ✅ Theme だけを designer/AI に選ばせる
- ✅ leaf 名は self-descriptive
- ✅ 使えないものは削除せず `_Reserved/` 退避
- ✅ Guide で全トークン被覆を担保
