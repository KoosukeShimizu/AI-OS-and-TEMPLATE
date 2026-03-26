# 42_javascript.md

## 参照タイミング
JavaScriptを編集する場合のみ参照する（初期化・data-*運用・モジュール方針の確認）。

## このファイルについて
**このファイルは「実装ガイド」である（役割分類：40〜42番台）。**  
JavaScriptの設計思想・分割方針・初期化ルール・責務分離・ライブラリ運用を定義する。  
AIはJS追加・修正時にこのファイルを参照すること。  

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**  
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-02-20
---

# 1. 基本思想（OS固定）

- 原則 Vanilla JS
- data-* 属性をトリガーにする（class依存しない）
- 機能単位で分割する（1ファイル1機能）
- main.js が唯一の初期化起点
- 見た目制御は行わない（CSSに委譲）
- 差分原則（全面置換・全面書き換え禁止）

---

# 2. 編集対象・出力対象

編集可能範囲・禁止対象の詳細は [ai/32_generation_rules.md](ai/32_generation_rules.md) を参照する。

---

# 3. ディレクトリ構造

構造図は [ai/24_directory_structure.md](ai/24_directory_structure.md) を参照する。

---

# 4. main.js

## 4-1. 役割

- モジュールのimport管理
- 初期化の起点
- DOMContentLoaded内で実行
- ON / OFF制御

---

## 4-2. 初期化ルール（必須）

- DOMContentLoaded は main.js にのみ記述する
- 各module内で DOMContentLoaded を書かない
- すべての初期化は main.js から呼ぶ

### 基本形（標準例）

```js
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initAccordion();
  initInview();
});
```

---

## 4-3. ON / OFF制御

- moduleのimportをコメントアウトして制御する
- 不要機能は読み込まない
- 使わない機能はコンパイル対象に含めない

例：

```js
// import { initLightbox } from "./_module/lightbox.js";
```

---

# 5. _module/

## 5-1. 役割

- 単一責任
- 1ファイル1機能
- 再利用可能前提
- 即時実行関数は禁止

例：

- _nav.js
- _accordion.js
- _inview.js
- _sticky.js
- _tab.js
- _dropdown.js

---

## 5-2. 設計ルール（必須）

- export function initX() 形式を推奨
- DOM探索は data-* で行う
- DOM取得後は必ず存在チェックを行う（必須）
- 見た目制御をしない（class付与まで）

例：

```js
export function initAccordion() {
  const elements = document.querySelectorAll('[data-accordion]');
  if (!elements.length) return;

  elements.forEach(el => {
    el.addEventListener("click", () => {
      el.classList.toggle("is-open");
    });
  });
}
```

---

# 6. data-*トリガー（原則固定）

JSはクラスではなく data-* を見る。

例：

- [data-nav-toggle]
- [data-inview]
- [data-accordion]
- [data-modal]

理由：

- 見た目classと責務分離
- CSS変更の影響を受けない
- 保守性向上

例外：

- 外部ライブラリ依存で不可の場合のみ許容（理由明記）

---

# 7. 状態管理（CSS連携）

## 原則

- JSが状態を付与
- CSSが見た目を制御

状態class例：

- is-open
- is-active
- is-current
- is-visible
- is-scroll-off
- is-disabled
- is-loading

---

# 8. イベント設計

- 多重バインド禁止
- 必要に応じてイベント委譲を検討する
- 再描画や動的生成要素に注意する
- 二重初期化を防ぐ設計を意識する

---

# 9. jQuery方針

原則使用しない。

例外：

- 既存案件で既に使用されている場合
- 必須ライブラリがjQuery依存の場合

ただし：

- 新規機能をjQueryで増やさない
- 既存jQueryコードの全面書き換えは禁止（差分原則）

---

# 10. _vendor/

## 役割

- 外部ライブラリ管理
- 直接改修しない
- 依存がある場合のみ読み込む

例：

- swiper
- slick
- mfp

---

# 11. ライブラリ導入ルール

以下に該当する場合は Todo 必須：

- 外部ライブラリ追加
- CSS依存が発生する
- 初期化コードが必要
- 状態が3種以上になる

必ず明記する：

- なぜ必要か
- 影響範囲
- CSS依存有無
- 初期化方法
- 将来的に削除可能か

---

# 12. フォームJS方針

- 可能な限りVanillaで実装
- 入力制御はdata-*で管理
- 外部依存は極力避ける
- バリデーション切り出しは案件ごとに検討する

---

# 13. 禁止事項

- DOMContentLoadedを各module内で乱立させる
- グローバル変数を作る
- 見た目制御をJSで行う
- CSS前提のJS実装
- data-*構造の破壊
- main.jsの初期化順序を壊す

---

# 14. 複雑作業判定（JS）

以下のいずれかでTodo作成必須：

- 2ファイル以上変更
- 状態が3種以上
- 外部ライブラリ導入
- 既存改修で影響範囲不明

Todoは最大7項目。

---

# 15. 破壊的変更禁止

- 既存モジュールの全面書き換え禁止
- data-*構造の破壊禁止
- main.jsの初期化順序破壊禁止
- 推測削除禁止

---

# 16. AI出力時のルール（JS）

- 差分単位で提案する（挿入位置を明記）
- 変更前/変更後を提示する（置換がある場合）
- 不明点は質問し、未確定事項として ai_context.md に残す
- 重要なトレードオフは ai_decision_log.md を検討する