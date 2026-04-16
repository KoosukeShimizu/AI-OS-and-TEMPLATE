# 65_figma_constraints.md

## 参照タイミング
Figma の Variables / Styles / Effects を Plugin API で操作する時に参照する。

## このファイルについて
**このファイルは「Figma API 制約集」である（役割分類：60番台）。**
既知の API 制約と回避策を列挙。AI は Figma 実装時に該当項目を先読みして落とし穴を回避する。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-16

---

## 制約1: lineHeight / letterSpacing の unit 強制変換

### 現象
- `text.lineHeight = {value: 140, unit: "PERCENT"}` にしてから `setBoundVariable("lineHeight", v)` すると、unit が PIXELS に強制変換される
- 結果：変数値 140 が「140px 行間」として適用され、フォントサイズに対して巨大になる
- letterSpacing も同様（0.02em 相当の 2 が 2px 字間として適用される）

### 回避策
- Variable binding を使わず、**Text Style 内で {value, unit: "PERCENT"} を直接定義**
- Text Style は unit を保持するため、PERCENT・em 相当が正しく適用される
- lh-*, ls-* の Theme Variable は `_Reserved/` に退避し、コード側では CSS `line-height` / `letter-spacing` で直接指定

### 実装コード例
```javascript
// NG: 以下は PIXELS に強制変換される
sample.lineHeight = {value: 140, unit: "PERCENT"};
sample.setBoundVariable("lineHeight", v);

// OK: Text Style 経由で適用
await sample.setTextStyleIdAsync(textStyle.id);
```

---

## 制約2: Shadow color alpha の bind は COLOR型のみ

### 現象
- `setBoundVariableForEffect(effect, "color", floatVar)` → エラー
- Shadow の不透明度を FLOAT 変数で管理しようとすると bind 不可

### 回避策
- Effect Style 内で alpha を直接 RGBA で指定（例：`a: 0.1`）
- sd-opacity 系 FLOAT 変数は `_Reserved/` に退避

---

## 制約3: hiddenFromPublishing API 不調

### 現象
- `variable.hiddenFromPublishing = true` を set すると "Node with id not found" エラーが出る場合あり
- 特に getLocalVariables 後にループ内で set すると高確率で失敗

### 回避策
- **`scopes = []`（空配列）を設定することで picker から非表示化**
- これは Config 層を隠す主要手段
- Library publish 時の挙動とは別の仕組みだが、現ファイル内の picker 制御には有効

### 実装コード例
```javascript
// Config 全変数を picker から隠す
const configVars = allVars.filter(v => v.name.startsWith("Config/"));
for (const v of configVars) {
  v.scopes = [];
}
```

---

## 制約4: 非同期API必須のプロパティ

以下は Async 版を使用する必要あり（同期版は deprecated）：
- `node.setTextStyleIdAsync(id)` — Text Style 適用
- `node.setEffectStyleIdAsync(id)` — Effect Style 適用
- `figma.variables.getVariableByIdAsync(id)` — Variable 取得
- `figma.getLocalTextStylesAsync()` / `figma.getLocalEffectStylesAsync()` — Style一覧取得

---

## 制約5: Variable binding は scope を bypass する

- 変数のscopeは picker 表示の制御のみで、API経由の `setBoundVariable` は scope チェックをしない
- つまり scope=[] でも bind は有効
- これが「Config を隠しつつガイドで bind」運用を成立させている

---

## 制約6: 負の値を width / height に bind できない

- ShadowSpread など負値を持つ Variable を rectangle.width に bind しようとすると失敗
- 負値が必要な場合は Effect の spread プロパティに直接 bind（effect は負値を許容）

---

## 制約7: BACKGROUND_BLUR / LAYER_BLUR に blendMode を付与するとバリデーションエラー

### 現象
```javascript
// NG: blendMode は DROP_SHADOW 等には必要だが BLUR系には不要
{ type: "BACKGROUND_BLUR", radius: 16, blendMode: "NORMAL" }
// → Unrecognized key(s) in object: 'blendMode'
```

### 回避策
- BLUR 系 effect は blendMode を含めない

---

## 制約8: Copy-Paste での Variable / Style 転送挙動

### 仕様
- 別ファイルにノードを paste すると、referenced な Variables と Styles は **ローカルに自動作成** される
- 階層パス（`Theme/01_Brand/primary` 等）も再現される

### 完全転送の条件
- **Guide内でその変数/スタイルが1箇所以上使われている（bind済み）** 必要がある
- 使われていない変数は転送されない
- STRING 変数は `text.setBoundVariable("characters", var)` で bind が必要

### 実践的運用
- Style Guide を「全トークン被覆担保」の役割で作成する
- コピペだけで Variables + Styles 両方が新ファイルに展開される
