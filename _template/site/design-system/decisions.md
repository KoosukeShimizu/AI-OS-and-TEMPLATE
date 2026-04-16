# Design System 意思決定ログ

このファイルにはプロジェクトの DS 設計で採用した重要な選択と、その理由を記録する。
「なぜこうなっているか？」を将来の自分・チーム・AI が理解できるようにするため。

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
