# 23_environment.md

## 参照タイミング
環境前提（Prepros等）やビルド方針に触れる場合のみ参照する。

## このファイルについて
本プロジェクトの技術環境および全体ルールを定義する。  
AIはファイル生成・修正時に本ファイルを前提とすること。

※ ディレクトリ構造（構造図）の参照先は [ai/24_directory_structure.md](ai/24_directory_structure.md) を参照すること。  
※ 本ファイルは「ルールのみ」を扱い、構造図は持たない。

Updated: 2026-02-24
---

# 1. 開発環境

- VSCode + GitHub Copilot
- Prepros使用
- Pug / SCSS / Vanilla JS（原則）

---

# 2. 出力・編集原則（必須）

編集可能範囲・禁止対象の詳細は [ai/32_generation_rules.md](ai/32_generation_rules.md) を参照する。

---

# 3. Pug 原則

- extendsは禁止（layout.pug禁止）
- includeは最小限（共通化で理解が落ちない範囲）
- ページは pug 直下フラット配置（階層化しない）
- control block は全ページ必須（項目は 40_markup_pug.md に従う）

---

## 3-1. includeの置き場（_includesは使わない）

pug/_includes フォルダは使用しない。  
includeは pug 配下で以下の3分類に分解する（SCSSの思想に揃える）：

- pug/_foundation（_global / _schema など）
- pug/_layout（_head / _header / _footer / _script / tracking系 など）
- pug/_component（_breadcrumb / _pagination / _floatbox など）

※ 具体の許可粒度は 40_markup_pug.md に従う  
※ 構造図の最終形は 24_directory_structure.md に従う

---

# 4. SCSS 設計原則

- scss配下の分類フォルダは _foundation / _layout / _component / _project / _utility を使用する
- プリミティブとテーマを分離する

## プリミティブ（横展可能・基本いじらない）
- 横展可能な値（基本資産）
- 原則変更しない（変更する場合は例外として明記する）

例：
- カラー定数（$c-gray 等）
- ベース値（font-size / z-index体系 / spacing基準）
- 関数・mixinの前提値

## テーマ（セマンティック・案件ごとに設定）
- :root のCSS変数で管理する
- 変数名はセマンティックにする（役割名）

例：
:root {
  --color-primary: #000;
  --color-accent: #f00;
}

## style.scss（ON/OFF）
- importで束ねる
- コメントアウトでON/OFF制御
- 不要なものはコンパイルに載せない

---

# 5. Script（JS）設計原則

- JSフォルダ名は script/ に統一する
- main.js で module を束ねる
- コメントアウトでON/OFF制御（必要なものだけ読み込む）
- 初期化は DOMContentLoaded を基本
- トリガーは data-* を基本（ライブラリ都合の例外は許容）
- 見た目はCSS、JSは挙動（class付与/状態制御まで）

---

# 6. ライブラリ方針

- 原則 jQuery は使わない
- 例外：既存案件で使用されている場合 / 必須ライブラリが依存する場合は許容
- ライブラリ導入時は「なぜ必要か」を説明できること

---

# 7. テンプレ運用（プロジェクト開始の起点）

標準テンプレは /_template 配下で管理する（/ai配下には置かない）。

- _template/site/（中規模以上）
- _template/lp/（ペライチLP）

運用方針：

- ヒアリング完了後、採用テンプレ（site or lp）をプロジェクトルート直下へ展開して開始する
- 展開後は「そのプロジェクトの実ファイル」が正となり、OSはルール参照として機能する
- テンプレに手を入れる場合は、意図と影響を明確化してから行う（必要なら decision_log）

---

# 8. 禁止事項

- 推測で削除する
- いきなり全体リライトする
- 既存命名・既存構造を勝手に破壊する
- __dist を直接編集する