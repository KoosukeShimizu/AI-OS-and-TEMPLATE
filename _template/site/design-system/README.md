# Design System

このプロジェクトのデザインシステム管理ディレクトリ。

## ファイル構成

| ファイル | 役割 |
|---------|------|
| `README.md` | このファイル。DS全体の概要 |
| `decisions.md` | 意思決定ログ（なぜその選択をしたか） |
| `figma-reference.md` | Figmaファイルへの参照と構造説明 |
| `tokens/tokens.json` | エクスポートしたトークン（W3C DTCG形式） |
| `tokens/tokens.example.json` | tokens.json のスキーマ例 |

## 基本原則

このプロジェクトは **AI-OS** の Figma 運用規約（`_ai-os/60-67`）に準拠する。
DS構築・更新時は必ず該当ドキュメントを参照すること。

## ワークフロー

1. **Figma で DS を設計** → Variables / Styles / Style Guide を作成
2. **tokens.json にエクスポート** → Variables2JSON 等のプラグイン利用
3. **Style Dictionary で各言語に変換** → CSS / SCSS / TS / Tailwind
4. **`decisions.md` に重要な決定を記録**
5. **新バージョンは changelog 的に管理**

## トークン更新時のチェックリスト

- [ ] Figma 側の `_Reserved/` に残すべきものを退避したか
- [ ] Config 層が `scopes = []` で picker 非表示のままか
- [ ] Theme 層の leaf 名が self-descriptive か
- [ ] Style Guide に新トークンが反映され、被覆が取れているか
- [ ] `decisions.md` に変更理由を記録したか
- [ ] `tokens.json` を再生成したか
