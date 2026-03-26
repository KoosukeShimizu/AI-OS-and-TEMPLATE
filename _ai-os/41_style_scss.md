# 41_style_scss.md

## 参照タイミング
SCSSを編集する場合のみ参照する（設計・配置・禁止事項の確認）。

## このファイルについて
**このファイルは「実装ガイド」である（役割分類：40〜42番台）。**  
SCSSの設計思想・分割粒度・import順序・責務分離・命名運用を定義する。  
AIはスタイル追加・修正時にこのファイルを参照すること。  

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**  
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-02-20
---

# 1. 基本思想（OS固定）

- 単発スタイルを作らない（まず再利用可能性を検討）
- 再利用前提で設計する（Modeにより抽出粒度は調整）
- 見た目と構造を分離する
- JSと責務を分離する（挙動はJS、見た目はCSS）
- style.scss を唯一の入口として import のON/OFFを管理する
- 不要なスタイルはコンパイルに含めない（importしない）

---

# 2. 編集対象・出力対象

編集可能範囲・禁止対象の詳細は [ai/32_generation_rules.md](ai/32_generation_rules.md) を参照する。

---

# 3. ディレクトリ責務（中規模以上）

構造図は [ai/24_directory_structure.md](ai/24_directory_structure.md) を参照する。

フォルダ責務：
- style.scss：唯一のエントリポイント
- _foundation/：土台（プロジェクト非依存の基盤）
- _component/：最小パーツ（再利用可能）
- _layout/：骨格（ページ構造の枠）
- _project/：ページ/プロジェクト固有（再利用不可寄り）
- _vendor/：ライブラリ調整
- _utility/：微調整（1責任）

※ フォルダ名は先頭に "_" を付ける（partialとして統一）

---

# 4. 読み込み順（固定）

style.scss 内での import 順は必ずこの順：

1. _foundation
2. _component
3. _layout
4. _project
5. _vendor（必要時のみ）
6. _utility

理由：
- 影響範囲の大きいものから積む（上書きの意図が明確になる）
- 探しやすく、差分修正が安全になる

---

# 5. Foundation（_foundation/）

Foundation は「基盤」。原則としてページ要件に引きずられない。

## 5-1. _config.scss（プリミティブ：OS固定）

- プロジェクト非依存の “材料” を置く
- 基本的に案件ごとに変更しない（変えるなら理由を明記）

含める例：
- Path / transition など基礎値
- Breakpoints（$mb〜$cinema）
- radius / shadow / easing
- grayscale / color scales（gray50-900 等）
- z-index設計
- 代表的なstatus色（danger/info/success等の材料）

### パレット方針（推奨：OS固定）
- gray / blue / green / red / orange などは 50〜900 の階調で揃える
- 変数名例：
  - $c-gray-50 ... $c-gray-900
  - $c-blue-50 ... $c-blue-900

※ “danger/info/success” のような意味付けは theme（CSS変数）側で行う（材料と意味を分ける）

## 5-2. _theme.scss（セマンティック：案件固定）

- プロジェクトごとに変わる “意味（役割）” を :root のCSS変数で管理する
- 命名は用途がわかるセマンティック命名にする

例：
- --text-primary / --bg-primary / --border-primary
- --btn-primary / --btn-on-primary
- --radius-*, --anim-*

NG例：
- --blue, --mainColor など曖昧な命名（理由がある場合のみ例外）

## 5-3. function / mixin / reset / base / font

- fz()/gt() などの関数は _foundation/function に置く
- mixinは _foundation/mixin に集約する
- reset/base/fontは foundation に置き、影響範囲を明確にする

---

# 6. Component（_component/）

## 役割
再利用可能なUIパーツ（最小単位）

例：
- button / form / typography / list / table / icon / accordion など

原則：
- 単一責任
- ページ依存禁止
- project用class（ページ固有事情）を混ぜない

---

# 7. Layout（_layout/）

## 役割
レイアウト構造管理（骨格）

例：
- header / footer / body / page / article

原則：
- 配置・構造が主
- 装飾は最小限（装飾の主戦場はcomponent/project）

---

# 8. Project（_project/）

## 役割
ページ固有スタイル（再利用不可寄り）

運用ルール：
- 記述量が少ない/コンポ寄りで済む場合：
  - _project/_project.scss にまとめてよい
- 中規模以上で増えてきた場合：
  - 必要ページだけ分割（_frontpage.scss 等）

---

# 9. Utility（_utility/）

## 役割
単機能補助クラス（微調整）

原則：
- 1クラス1責任
- 再利用可能
- JS依存しない（JS前提の見た目調整を置かない）

---

# 10. ON / OFF制御（必須）

style.scss の import をコメントアウトして制御する。

例：
// @import "./_component/lightbox";
// @import "./_component/tab";

不要なスタイルはコンパイルに含めない。

---

# 11. JSとの責務分離（OS固定）

- 見た目制御はCSS
- 状態付与はJS
- JSは「状態classを付与する」まで
- CSSは状態classで見た目を制御する

状態class例：
- .is-open
- .is-active
- .is-current
- .is-scroll-off

---

# 12. 命名運用

## 12-1. classの表記
- class命名は kebab-case を標準とする（camelCaseは禁止）
- BEMは過度に深くしない（ページから構造が読める粒度を保つ）

## 12-2. prefix（採用する場合）
※ prefix運用（l-/c-/u-/is-）の最終確定は 22_naming.md を正とする。  
※ 既存案件は既存踏襲を優先し、全面リネームはしない。

採用する場合の規約：
- layout: l-
- component: c-
- project: 接頭語なし（22_naming.md準拠）
- utility: u-
- state: is-

---

# 13. 禁止事項

- ページ専用スタイルを component に書く
- JS挙動を前提とした “見た目依存クラス” を増殖させる
- 意味のないラッパー前提のスタイル設計
- import順の逆転（依存関係を読めなくする）

---

# 14. 破壊的変更禁止

- foundationの全面変更は禁止（差分で行う）
- 既存命名規則の破壊は禁止（まず踏襲）
- theme変数の削除は禁止（影響範囲が広い）
- 大規模な移動/改名が必要な場合は decision_log を検討する

---

# 15. AI出力時のルール（SCSS）

- 差分単位で提案する（挿入位置を明記）
- 変更前/変更後を提示する（置換がある場合）
- 不明点は質問し、未確定事項として ai_context.md に残す