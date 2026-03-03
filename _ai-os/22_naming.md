# 22_naming.md

## 参照タイミング
以下に該当する場合は必ず参照する（命名の新規決定・変更が発生するタイミング）：

- 新規コンポーネント/新規セクションのクラス名を付与する
- data-* トリガー名を新規作成・変更する
- 新規JS module（script/_module）を作成・命名する
- 既存命名と異なる命名案を採用しようとしている（表記揺れ・衝突の可能性）

## このファイルについて
CSSクラス名・JS命名・ファイル命名のルールを定義する。  
命名は「可読性」「衝突回避」「拡張性」のために存在する。

AIは命名を推測で変更しないこと。  
既存命名がある場合は原則踏襲する（30_conflict_resolution.md参照）。

Updated: 2026-02-20
---

# 1. 命名の基本思想

- 意味ベースで命名する（見た目ではなく役割）
- 短すぎない（略語乱用禁止）
- 再利用を前提とする
- BEMライクだが“厳格BEM”ではない
- ページから構造が読める粒度を守る
- 命名は「揃えるほど強い」。例外は decision_log に寄せる

---

# 2. CSS命名ルール（OS固定）

## 2-1. 表記（case）ルール

- class名は **kebab-case固定**
- camelCase禁止（例：aboutList__item はNG）
- snake_case禁止（例：about_list はNG）

理由：
- HTML/CSS/URLで統一しやすい
- 記号密度を抑え、視認性を保つため

---

## 2-2. プレフィックス体系（固定）

### Layout（再利用前提）
.l-xxxx  
例：
- .l-wrapper
- .l-main
- .l-section

### Component（再利用前提）
.c-xxxx  
例：
- .c-btn
- .c-form
- .c-card
- .c-text

### Utility（補助）
.u-xxxx  
例：
- .u-mt-l
- .u-text-center
- .u-hidden

### State（状態）
.is-xxxx  
例：
- .is-active
- .is-open
- .is-error
- .is-current

---

## 2-3. ページ専用クラス（固定）

- **.p- プレフィックスは使用しない（禁止）**
- ページ専用クラスは **「接頭語なし」** で記述する

例：
- .about-hero
- .reserve-header
- .contact-flow

原則：
- 接頭語なし = ページ専用構造
- 接頭語あり（.l- / .c- / .u-） = 再利用構造

### 昇格ルール（重要）

接頭語なしクラスが別ページでも再利用されることが判明した場合：

→ **c-へ昇格させる（命名統一して以後はcomponentとして運用）**

勝手に放置しない。混在させない。

※ 既存で .p- が存在する案件は「踏襲」し、勝手に削除しない（差分原則）

---

## 2-4. BEMライク構造（固定）

- Block：.c-card
- Element：.c-card__title
- Modifier：.c-card.-primary
- 状態：.is-active / .is-open / .is-error

ルール：

- Elementは `__` を使用
- Modifierは **`. -xxx`（ハイフン1本）** を使用（`--`は使わない）
- 状態は `is-` プレフィックス固定
- JS用フックは **classではなく data-* 優先**
- Elementのネストは **最大2段まで**（`__` の多段化を避ける）
  - 例：`.c-card__head__title` は避ける

---

# 3. 省略語ルール（固定）

## 3-1. 許可する省略語（OS固定）

以下は使用可：

- btn（button）
- nav（navigation）
- img（image）
- bg（background）
- cta（call to action）
- faq
- modal
- tab
- card
- kv（案件文脈で通じる場合のみ）

---

## 3-2. 原則フルスペルとする単語

以下は省略しない：

- text（txtは禁止）
- title（ttlは原則使わない）
- content（cnt禁止）

---

## 3-3. 混在禁止（超重要）

- c-btn と c-button を混在させない
- text と txt を混在させない
- title と ttl を混在させない

OSでは **「c-btn」「c-text」** を標準とする。  
（既存が c-button / c-typography 等の体系なら、踏襲して混在を避ける）

---

# 4. ファイル命名ルール（OS固定）

## 4-1. Pug / HTML

- **ハイフン区切りで統一（underscoreは禁止）**
- 例：
  - about.pug
  - news-detail.pug
  - reserve-confirm.pug

理由：
- 可読性が高い
- URLとの整合性が良い
- CSS/JS命名と統一しやすい

---

## 4-2. SCSS

- `_xxxx.scss` 形式（partial）
- ハイフン区切り
- 例：
  - _about.scss
  - _reserve-confirm.scss
  - _form-error.scss

---

## 4-3. JS

- `_xxxx.js` 形式（module）
- ハイフン区切り
- 例：
  - _form-error.js
  - _page-top.js

---

# 5. JS命名ルール

## 5-1. ディレクトリ（固定）

- script/
  - main.js
  - _module/
  - _vendor/

---

## 5-2. 原則

- 1ファイル1責任
- DOMContentLoadedは main.js でまとめる
- 見た目制御はしない（class付与まで）
- 既存構造を勝手に書き換えない（差分原則）

---

## 5-3. data-* 優先（固定）

- JSトリガーは原則 data-* を使う
- classは見た目用途
- JS依存classは極力作らない

### data-* 基本形

基本構造：

- `data-[feature]`
- `data-[feature]-[role]`
- `data-[feature]-target`
- `data-[feature]-group`

例：

- data-nav-toggle
- data-nav-body
- data-accordion
- data-modal-open
- data-modal-close
- data-modal-target

---

# 6. key命名ルール（ナビcurrent制御）

- keyはナビグループ単位で決める
- form/confirm/thanks は同一keyにできる
- slugと混同しない

例：

key = "contact"  
slug = "contact-confirm"

---

# 7. URL方針（補足）

- URLは **kebab-case推奨**
- underscoreは使用しない（統一のため）
- 小文字固定

例（推奨）：
- news-detail.html

---

# 8. 禁止事項

- 見た目依存命名（.red-boxなど）
- JSとCSSで責務混在
- 全面リネーム
- 既存命名を推測変更
- underscoreによるファイル命名
- classのcamelCase化

---

# 9. 例外運用

既存案件で命名体系が異なる場合：

- 原則踏襲する
- 新規部分から段階的に整える
- 大規模変更は decision_log に記録する

---

# 10. AI出力時の命名チェック

- プレフィックスは正しいか？
- ページ専用と再利用構造が混在していないか？
- BEM構造が崩れていないか？
- 省略語ルールを破っていないか？
- JSフックがclass依存になっていないか？
- key と slug を混同していないか？