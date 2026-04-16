# Figma ファイル参照

このプロジェクトで使用している Figma ファイルの構造と運用情報を記録する。

## ファイル情報

| 項目 | 値 |
|------|-----|
| ファイル名 | _（例：NDS_v2 Design System）_ |
| File Key | _（例：eZuOYxqc0RHxSkFQ0K6jWj）_ |
| Figma URL | _（例：https://figma.com/design/{key}）_ |
| 主ページ名 | _（例：✅️ NDS_v2）_ |

## Variable Collections

| Collection | 状態 | 備考 |
|-----------|------|------|
| _（例：NDS_v2）_ | アクティブ | 現行運用 |
| _（例：NDS_v1）_ | バックアップ | scopes=[] で picker 非表示化済み |

## ページ構成

| ページ | 内容 |
|-------|------|
| _（例：✅️ NDS_v2）_ | 現行DS と Style Guide |
| _（例：🗄 Archive）_ | 過去バージョン |

## Style Guide ノードID

| セクション | Node ID | 説明 |
|-----------|---------|------|
| Config Guide（A-1〜A-n） | _（例：223:2）_ | Config層の視覚ドキュメント |
| Theme Guide（B-1〜B-n） | _（例：294:2）_ | Theme層の視覚ドキュメント |

## モード構成

| モード | 用途 |
|-------|------|
| PC-Light | デスクトップ・ライトテーマ |
| SP-Light | モバイル・ライトテーマ |
| PC-Dark | デスクトップ・ダークテーマ |
| SP-Dark | モバイル・ダークテーマ |

## Style 一覧

### Text Styles

| 名前 | 用途 |
|------|------|
| _（例：Heading/heading-h1）_ | _（例：ヒーロー・大見出し）_ |

### Effect Styles

| 名前 | 用途 |
|------|------|
| _（例：Shadow/shadow-m）_ | _（例：カード・ドロップダウン）_ |

## 特記事項

- _Reserved/ に退避されている Variable と理由
- Figma API 制約による影響（あれば）
- その他プロジェクト固有の注意点

## アクセス

- Figma ファイルへのアクセス権：_（チーム情報）_
- MCP 経由で操作する場合：Figma MCP Server 経由
- 認証切れ時の再認証手順：_（あれば記載）_
