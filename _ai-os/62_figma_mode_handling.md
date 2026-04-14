# 62_figma_mode_handling.md

## 参照タイミング
Figma の L/D・PC/SP モードをコードへ落とし込む場合に参照する。

## このファイルについて
**このファイルは「デザインシステム変換規約」である（役割分類：60番台）。**
Figma Modes（Light/Dark, PC/SP）の CSS 変換ルールを定義する。
AI は theme/メディアクエリ生成時にこのファイルを必ず参照すること。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-14
---

# Figma Modes ハンドリング

## モード構成
Figma 側は 4モード管理：
- PC-Light / SP-Light / PC-Dark / SP-Dark

## L/D モード → CSS 変換
- CSS変数は `:root` で Light、`[data-theme="dark"]` で Dark 上書き
- Figma モード切替 = コード上の theme 切替に対応

例:
```css
:root { --bg-default: #ffffff; }
[data-theme="dark"] { --bg-default: #0a0e1a; }
```

## PC/SP モード → メディアクエリ変換
- PC値 = デスクトップブレークポイント（1024px以上）
- SP値 = モバイルブレークポイント（〜767px）
- 変数が PC/SP で異なる値を持つ場合、CSS はメディアクエリで切替

例:
```css
:root { --gap-m: 16px; /* SP */ }
@media (min-width: 1024px) { :root { --gap-m: 20px; /* PC */ } }
```

※ 差分のない変数は media query 不要。
