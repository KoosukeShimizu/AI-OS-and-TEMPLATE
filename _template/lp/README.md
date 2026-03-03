# Design Tokens Reference

プロジェクトで使用する共通の設計トークン一覧です。
SCSSの変数・CSSカスタムプロパティなどと連携して管理します。

---

## 🎨 グレースケール（Gray Scale）

| トークン名         | 用途例      | 色コード      | 備考       |
| ------------- | -------- | --------- | -------- |
| `$c-gray-100` | 背景最明色    | `#f9f9f9` | 明るい背景用   |
| `$c-gray-200` | セクション背景  | `#f0f0f0` | ページ分割等   |
| `$c-gray-300` | 境界・ボーダー  | `#dcdcdc` | 線や区切り線   |
| `$c-gray-400` | 補助テキスト   | `#bdbdbd` | プレースホルダ等 |
| `$c-gray-500` | 非アクティブ状態 | `#9e9e9e` | ディセーブル等  |
| `$c-gray-600` | 通常テキスト   | `#7f7f7f` | 読みやすい灰色  |
| `$c-gray-700` | 強調テキスト   | `#5c5c5c` | ボディコピー等  |
| `$c-gray-800` | タイトル・見出し | `#3b3b3b` | Hタグ推奨    |
| `$c-gray-900` | 背景最暗色    | `#1f1f1f` | ブラックに近い色 |

---

## ✅ システムカラー（状態表示用）

| 状態        | トークン                   | 色コード      | 備考      |
| --------- | ---------------------- | --------- | ------- |
| Danger    | `$c-danger-default`    | `#e53935` | エラー、削除系 |
| Important | `$c-important-default` | `#ff9800` | 強調、注目   |
| Info      | `$c-info-default`      | `#2196f3` | 情報、補足   |
| Success   | `$c-success-default`   | `#4caf50` | 成功、完了   |
| Mute      | `$c-mute-default`      | `#9e9e9e` | 無効、グレー系 |

※ 各色に対して `-light` / `-lighten` / `-dark` / `-darken` も定義あり

---

## 🔗 リンクカラー

| トークン              | 用途     | 色コード      |
| ----------------- | ------ | --------- |
| `$c-link-default` | 通常リンク色 | `#1a73e8` |
| `$c-link-light`   | 補助リンク色 | `#64a0f5` |
| `$c-link-dark`    | 強調リンク色 | `#155ab6` |

---

## 📱 SNSブランドカラー

| SNS       | トークン名                    | 色コード      |
| --------- | ------------------------ | --------- |
| Facebook  | `$sns-facebook-default`  | `#3b5998` |
| Twitter   | `$sns-twitter-default`   | `#1da1f2` |
| LINE      | `$sns-line-default`      | `#00c300` |
| Pinterest | `$sns-pinterest-default` | `#cb2027` |
| YouTube   | `$sns-youtube-default`   | `#cd201f` |

※ SNSも各種 `-light`, `-dark` バリエーションあり

---

## 💡 補足

* このドキュメントは `tokens.scss` / `_config.scss` と連動します。
* UIパーツ別に使用するトークンのルールは各コンポーネントのSCSSで定義してください。
* この一覧は**開発・デザイン共通言語としての辞書**です。
