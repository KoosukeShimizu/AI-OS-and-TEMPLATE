# 24_directory_structure.md

## 参照タイミング
以下に該当する場合は必ず参照する（構造・配置の判断が発生するタイミング）：

- 新規ページ作成 / 新規ファイル作成で配置先を決める
- 新規フォルダ作成 / フォルダ移動 / リネーム / 削除が発生する
- pug/scss/script の構造（下位フォルダの追加を含む）を変更する
- 出力物（__dist/）の配置・パス・assets構成の判断が必要

## このファイルについて
本OSにおける「標準ディレクトリ構造（構造図のみ）」を定義する。  
規模に応じてどの構造を採用するか判断するための参照表である。

※ フォルダ責務・禁止事項・設計ルールは 23_environment.md を参照すること。  
※ SSoT定義は [ai/01_os_lock.md](ai/01_os_lock.md) を参照する。本ファイル（24）は構造図（ディレクトリ構造）の参照先である。

Updated: 2026-02-24
---

# 1. 中規模以上（標準構造）

root/
├── ai/                         ← OSルール専用（実装禁止 / ビルド対象外）
├── _template/                  ← 雛形参照用（本番構造に含めない）
│   ├── site/
│   └── lp/
│
├── pug/
│   ├── index.pug
│   ├── about.pug
│   ├── ...
│   │
│   ├── _foundation/
│   │   ├── _global.pug
│   │   └── _schema.pug
│   │
│   ├── _layout/
│   │   ├── _head.pug
│   │   ├── _header.pug
│   │   ├── _footer.pug
│   │   ├── _side.pug
│   │   ├── _script.pug
│   │   ├── _trackingTag_head.pug
│   │   └── _trackingTag_body.pug
│   │
│   └── _component/
│       ├── _breadcrumb.pug
│       ├── _pagination.pug
│       ├── _floatbox.pug
│       └── ...
│
├── scss/
│   ├── style.scss
│   ├── _foundation/
│   │   ├── _reset.scss
│   │   ├── _base.scss
│   │   ├── _mixin.scss
│   │   ├── _function.scss
│   │   ├── _config.scss
│   │   └── _theme.scss
│   ├── _layout/
│   │   ├── _header.scss
│   │   ├── _footer.scss
│   │   ├── _body.scss
│   │   ├── _page.scss
│   │   └── _article.scss
│   ├── _component/
│   │   ├── _button.scss
│   │   ├── _form.scss
│   │   ├── _accordion.scss
│   │   └── ...
│   ├── _project/
│   │   ├── _top.scss
│   │   ├── _about.scss
│   │   └── ...
│   └── _utility/
│       ├── _space.scss
│       ├── _text.scss
│       ├── _display.scss
│       └── ...
│
├── script/
│   ├── main.js
│   ├── _module/
│   │   ├── _nav.js
│   │   ├── _accordion.js
│   │   ├── _inview.js
│   │   └── ...
│   └── _vendor/
│       ├── _swiper.js
│       ├── _slick.js
│       └── ...
│
└── __dist/
    ├── index.html
    ├── about.html
    ├── ...
    └── assets/
        ├── img/
        │   ├── common/
        │   │   ├── logo.png
        │   │   ├── ogp.png
        │   │   └── ...
        │   ├── pageA/
        │   └── ...
        ├── css/
        │   └── style.css
        └── js/
            └── main.js

---

# 2. ペライチLP（簡易構造）

root/
├── ai/                         ← OSルール専用（実装禁止 / ビルド対象外）
├── _template/                  ← 雛形参照用（本番構造に含めない）
│   ├── site/
│   └── lp/
│
├── index.pug                   ← ページ用（LP-MIN control blockを持つ / version必須）
├── scss/
│   ├── style.scss
│   ├── _foundation/
│   ├── _component/
│   └── _utility/
├── script/
│   ├── main.js
│   ├── _module/
│   └── _vendor/
└── __dist/

---

# 3. 採用判断（目安）

- ページ数が複数 / 共通UIがある / 更新が継続する  
  →「中規模以上」構造を採用

- 単ページ完結 / 共通化不要 / 短期用途  
  →「ペライチLP」構造を採用

---

# 4. 命名固定ルール（構造上）

- JSフォルダは script/ に統一
- 出力は __dist/ に統一
- includeは pug/_foundation / _layout / _component に分解する
- 編集資産と成果物は完全分離する
- _template/ は参照専用であり本番に含めない（必要ならプロジェクト直下へ展開して使用する）