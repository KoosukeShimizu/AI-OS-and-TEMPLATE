# 40_markup_pug.md

## 参照タイミング
以下に該当する場合は必ず参照する（Pug編集時）：

- 新規ページPugを作成する
- 既存ページPugの構造（セクション/見出し/ラッパー）を変更する
- include追加・control block追加/変更を行う
- 既存構造を整理する目的でラッパーやブロック分解を変更する

## このファイルについて
**このファイルは「実装ガイド」である（役割分類：40〜42番台）。**  
Pug（HTMLマークアップ）の設計原則・作法・分割粒度・control blockを定義する。  
AIはPugを生成/修正する際にこのファイルを参照すること。  

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**  
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-02-20
---

# 1. 絶対ルール

- extendsは禁止（layout.pug禁止）
- includeは最小限（ページから構造が読める粒度を守る）
- ページPugは pug/ 直下にフラット配置（階層化しない）
- __dist は編集しない（23_environment.md）
- 推測で削除しない（32_generation_rules.md）

---

# 2. includeの粒度（中規模以上）

許可するinclude（原則固定）：

- pug/_layout/_head.pug（meta/OGP/noindex/CSS読み込みブロック含む）
- pug/_layout/_header.pug
- pug/_layout/_footer.pug
- pug/_layout/_side.pug（必要な場合のみ）
- pug/_layout/_script.pug（共通JSの読み込みブロック）
- pug/_layout/_trackingTag_head.pug（必要な場合のみ）
- pug/_layout/_trackingTag_body.pug（必要な場合のみ）
- pug/_foundation/_global.pug（サイト共通変数・パス・共通設定）
- pug/_foundation/_schema.pug（構造化データ。必要時のみ）
- pug/_component/_breadcrumb.pug（必要なものを必要なだけ）

原則：

- 中規模以上は「head/script/tracking/schema」を _layout/ に寄せ、ページ側は control block でON/OFFする
- ページ独自UIまで include で分割しない（ページから読めなくなるため）
- 追加が必要な場合は ai_outline.md に明記し、必要なら decision_log に記録する

---

# 3. ページファイルの基本構造（推奨テンプレ）

ページPugは以下の順序を崩さない：

1) include global  
2) control block（ページ変数）  
3) doctype / html / head  
4) tracking(head)  
5) body  
6) tracking(body)  
7) wrapper → header/main/footer  
8) block append css / js（ページ固有の追加）

---

# 4. control block（ページ冒頭に必ず置く）

control block は「ページからページ仕様を制御できる」ことが目的。  
規模でテンプレを分ける（中規模以上 / ペライチLP）。

---

## 4-1. 中規模以上：STANDARD（標準）

### A) パス・識別（必須）

- root（ルートパス）
- key（ナビcurrent制御）
- slug（パンくず用）
- parentSlug（親slug。空でも保持）
- version（静的アセット用。必須）

versionは日付（YYYYMMDD）で管理する。

例：
- var version = "?v=20260220"

---

### B) head制御

- useNoindex
- useOgp
- useAnalytics
- useLogoH1
- useBreadcrumb

中規模以上では「ページ単位で制御できる形」を維持する。

---

### C) schema制御（必要時のみON）

- useSchemaWebSite
- useSchemaWebPage
- useSchemaOrganization
- useSchemaBreadcrumb
- useSchemaArticle
- useSchemaFAQ

---

### D) meta情報（ページ固有）

- pageTitle
- pageDescription
- pageKeywords

---

### E) OGP（useOgp=trueのとき有効）

- pageOgUrl
- pageOgTitle
- pageOgDescription
- pageOgImage

---

### F) 運用系（必要時のみ）

- pattern
- state
- cpEnd

---

## 4-2. ペライチLP：LP-MIN（最小）

LPでも version は必須。

### 必須

- root
- version（?v=YYYYMMDD 形式）

### 任意

- pattern
- state
- cpEnd

LPでは head直書き前提のため use○○ 系は原則不要。

---

# 5. key と slug の役割分離（固定）

- key：ナビcurrent制御用
- slug：パンくず用
- parentSlug：パンくず階層用

禁止：

- slug を current制御に使う
- key と slug の混同

---

# 6. 静的アセット読み込み（LP含めて version 必須）

キャッシュ事故を防ぐため、静的アセットには version を付与する。

対象：

- CSS
- JS
- 画像（img）
- video / source
- favicon
- OGP画像

---

## 6-1. CSS / JS

例：

- link(rel="stylesheet" href=root+cssPath+"main.css"+version)
- script(src=root+jsPath+"main.js"+version)

---

## 6-2. 画像（原則付与）

例：

- img(src=root+imgPath+"about/about-kv.jpg"+version alt="採用情報メインビジュアル" loading="lazy")

原則：

- 差し替え可能性がある画像は必ず付与
- KV / バナー / OGP は必須
- ロゴも可能なら付与

---

## 6-3. favicon

例：

- link(rel="shortcut icon" href=root+imgPath+"common/favicon.ico"+version type="image/x-icon")

---

## 6-4. OGP画像

例：

- var pageOgImage = root+imgPath+"common/ogp.png"+version

---

# 7. head設計

中規模以上：

- meta・OGP・noindexは _head.pug に集約
- control block の use○○ で分岐

LP：

- head直書きで良い
- ただし version は必ず付与

---

# 8. JSトリガー設計

- JSトリガーは data-* を基本とする
- classは見た目用途
- JSは挙動のみ（class付与まで）

---

# 9. 破壊的変更の禁止

- extends導入は禁止
- include増殖は禁止
- 既存構造を勝手に再設計しない
- 既存classを推測削除しない

---

# 10. AI出力時のルール

- 差分単位で提案する
- 変更前/変更後を提示する
- version更新が必要か必ず確認する