# 66_figma_guide_structure.md

## 参照タイミング
Style Guide を Figma 上で作る・更新する時に参照する。

## このファイルについて
**このファイルは「Style Guide 設計テンプレート」である（役割分類：60番台）。**
デザインシステムの視覚ドキュメントをFigma上にどう構築するかを定義。

> **絶対ルール（強制）は `32_generation_rules.md` が Single Source of Truth。**
> 本ファイルの指針と 32 の強制ルールが矛盾する場合は、**32 を優先する**。

Updated: 2026-04-16

---

## Guide の二重の目的

Style Guide は以下2つの役割を同時に果たす：

1. **視覚ドキュメント（人間向け）**
   - デザイナー・エンジニアが値や見た目を確認する場
   - どのトークンがあるか一覧できる

2. **トークン「使用」状態の担保（移植用）**
   - Figma の copy-paste は「使われている変数・スタイル」のみ転送する
   - Guide で全トークンを bind しておくことで、Guide フレームごとコピーで完全転送が成立

この二重性を意識して設計する。

---

## マスターフレーム構造

### 命名規則
```
[Guide] {SystemName} Style System    ← Config層のガイド
[Guide] {SystemName} Theme System    ← Theme層のガイド
```

### 内部セクション
```
Guide/
├── hdr/[Layer Name]               ← マスターヘッダー（48px Semi Bold）
├── subhdr/A-1 {Category}          ← サブセクションヘッダー（32px Semi Bold、背景色つき）
├── body                           ← 中身
├── divider                        ← 1px セクション区切り
├── subhdr/A-2 ...
├── body
├── ...
└── footer                         ← 補足情報
```

### セクション番号ルール
- Config層: A-1, A-2, ... A-n
- Theme層: B-1, B-2, ... B-n
- 数字prefix で Figmaパネル・ガイド上の並び順を制御

---

## カテゴリ別の視覚化手法

### 1. カラー系（Brand / Surface / Notice）
- **丸チップグリッド**（48×48 ellipse）が基本
- L/D モードの列を分離し、背景ストリップで視覚差を提示
  - Light strip: gray-50 背景
  - Dark strip: gray-900 背景
- 背景色と融合するチップは **border-default の 1px アウトライン** を付与
- 末尾に hex コード表示（モード解決値）

### 2. テキスト色系（Text）
- チップではなく **実テキストサンプル**（"Aa サンプル 123"）
- 対象色を fill として適用し、実際の見え方を示す
- 特殊な on-* / inverse は専用背景（on-primary は primary 背景等）の上に配置

### 3. ボーダー色系（Border）
- 実際の Stroke として描画（2px 太線の矩形）
- border-inverse は bg-inverse の上に配置

### 4. 数値スケール系（Spacing / Width / Radius）

| 種類 | 手法 |
|------|------|
| Spacing（〜48px） | 実寸バー（縦積み2段で PC/SP 比較） |
| Width（〜1920px） | 実寸バー（clipsContent=false で frame 幅超え可） |
| Radius | 72×72 矩形に cornerRadius を実適用 |
| Gap（PC/SP差分あり） | 横バー2段重ね、値ラベルをバー横に併記 |
| Section（縦方向空間） | 縦バー2本並び、上揃い |

### 5. Effect 系
- **Drop Shadow**: 白地ボックスに実際の shadow 適用（段階ごとに並べて比較）
- **Backdrop Blur**: bokeh パターン（彩度高い円オブジェクト配置）の上に半透明白ボックス重ねる
- **Inner Shadow**: gray-50 ボックスに inner shadow 適用
- **Focus Ring**: 白地ボックスに spread shadow 適用

### 6. Typography 系
- Text Style を **実際のテキストに適用**（"NOBIII Design System / デザインシステム"）
- サイズ・太さ・行間・字間の違いが視覚で判別できる
- 各行に Style 名とスペック併記（"40px / Bold / lh 125% / ls -0.01em" 等）

### 7. Content（STRING）系
- 実際のプレースホルダー文字列を表示
- `text.setBoundVariable("characters", var)` で bind（移植時に文字列変数が転送されるため必須）

### 8. State（Opacity）系
- 青色矩形に opacity を適用して実見え確認
- Variable から値を取得して可視化

---

## 全トークン被覆の担保

### チェックリスト
Guide を作り終えたら以下を確認：

1. ✅ 全 Variables に対して「Guide内のどこかで1箇所以上 bind されている」
2. ✅ 全 Text Styles が Guide 内のテキストで適用されている
3. ✅ 全 Effect Styles が Guide 内の要素で適用されている
4. ✅ STRING 変数は characters に bind されている（raw表示ではない）

### 確認方法（Plugin API）
```javascript
// 全 Variable ID を取得
const allVarIds = figma.variables.getLocalVariables()
  .filter(v => v.variableCollectionId === targetCollId && !v.name.includes("_Reserved"))
  .map(v => v.id);

// Guide フレーム内で bind されている Variable ID を収集
const usedIds = new Set();
master.findAll(n => {
  if (n.boundVariables) {
    for (const prop of Object.values(n.boundVariables)) {
      if (Array.isArray(prop)) prop.forEach(p => usedIds.add(p.value?.id || p.id));
      else usedIds.add(prop.id || prop.value?.id);
    }
  }
  return false;
});

// 差分を確認
const uncovered = allVarIds.filter(id => !usedIds.has(id));
```

### 判定基準

- **OK**：`uncovered.length === 0`（全 Variable が Guide 内で最低 1 箇所 bind されている）
- **要対応**：`uncovered.length > 0`（未 bind Variable を Guide に追加するか、削除判断）

補足：
- `_Reserved/` / `⚠_` prefix の Variable は除外対象。カウントに含めない
- STRING 変数は `characters` bind が必須（下記「移植時チェックリスト」参照）
- Text Style / Effect Style も同様に被覆確認（使用している Style の id を収集し、全 Style との差分を取る）

### 検証用スクリプト雛形

```javascript
// 1. 対象 Collection の全 Variable を列挙
const targetColl = await figma.variables.getVariableCollectionByIdAsync(COLLECTION_ID);
const allVars = (await figma.variables.getLocalVariablesAsync())
  .filter(v =>
    v.variableCollectionId === targetColl.id
    && !v.name.includes("_Reserved/")
    && !v.name.startsWith("⚠_")
  );

// 2. Guide フレーム配下の bind 収集（前述のコード）
// 3. 差分出力
console.log(`Total: ${allVars.length}`);
console.log(`Covered: ${allVars.length - uncovered.length}`);
console.log(`Uncovered (${uncovered.length}):`);
uncovered.forEach(id => {
  const v = allVars.find(x => x.id === id);
  console.log(`  - ${v.name}`);
});
```

被覆率 100% が Guide 完成の判定条件。

## 移植時チェックリスト（Copy-Paste 直前）

Guide フレームを他ファイルへコピー移植する前に、以下を確認：

- [ ] 全 Variable が Guide 内で bind されている（被覆 100%）
- [ ] 全 Text Style が Guide 内のテキストで適用されている
- [ ] 全 Effect Style が Guide 内の要素で適用されている
- [ ] **STRING 変数は `text.setBoundVariable("characters", var)` で bind されている**（raw 文字列表示ではダメ）
- [ ] `_Reserved/` 配下は bind しなくて OK（移植対象外）

### STRING 変数の bind 確認手順

STRING 変数（Content 系）は **`characters` プロパティに bind** されていないと移植時に転送されない。

**確認方法**：
1. Guide 内の対象テキストを選択
2. Variables パネルで `characters` プロパティに Variable アイコンが付いているか確認
3. 付いていなければ Variables パネルで該当 STRING 変数を `characters` に bind

**Plugin API での一括チェック**：
```javascript
const stringVars = allVars.filter(v => v.resolvedType === "STRING");
const unboundStrings = stringVars.filter(v => !usedIds.has(v.id));
if (unboundStrings.length > 0) {
  console.warn("以下の STRING 変数が未 bind。移植時に転送されません：");
  unboundStrings.forEach(v => console.warn(`  - ${v.name}`));
}
```

---

## レイアウト設計指針

- マスター幅は **2392px**（または類似の大きな値）を推奨
- master は VERTICAL auto-layout、各セクションは FILL で幅揃え
- body 内の配置は HORIZONTAL / VERTICAL を使い分け
- 実寸バー等が超える可能性がある箇所は **clipsContent = false**
- ラベル幅は **100px** 程度で統一（読みやすさと密度のバランス）
