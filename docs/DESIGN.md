# English Shift v0.1 Design

## 1. コアループ

```text
Customer opening line
        ↓
質問を選ぶ
        ↓
英語の返答を読む
        ↓
Hidden Factを開示
        ↓
商品を選ぶ
        ↓
Recommendation Score
        ↓
次の客
```

## 2. 客データ

客の年齢そのものは推薦計算に使わない。推薦に使うのは `needs.weights` と予算。
年齢や役割は会話の背景・シナリオ生成に使う。

```ts
Customer {
  age
  budget
  budgetFlex
  needs.weights
  facts
  questions
  optimalQuestionCount
}
```

## 3. 商品データ

```ts
Product {
  category
  price
  features
}
```

`features` は 0.0〜1.0。

## 4. Product Fit

客のNeed weightと商品のFeatureを加重平均する。

```text
Need Fit = Σ(NeedWeight × ProductFeature) / Σ NeedWeight
Product Fit = Need Fit - Budget Penalty
```

これは「その商品自体が客にどの程度合うか」という絶対値。

## 5. Choice Quality

店にある同カテゴリ商品の中の最良Fitを100とした相対評価。

```text
Choice Quality = Chosen Product Fit / Best Available Fit × 100
```

これにより、その店で最善の商品を選んだのに絶対Fitが88%だったためEfficiencyが取れない、という問題を避ける。

## 6. Efficiency Bonus

Choice Quality 90%以上の推薦だけ対象。

```text
最適質問数          +30
最適 + 1問          +20
最適 + 2問          +10
それ以上             +0
```

商品選択を外した場合は質問を少なくしても高Efficiencyにならない。

## 7. Information Value

各Factに `decisionWeight` を持たせる。
質問が未開示Factをどれだけ開くかを `Information Gain` として画面に表示する。

将来的にはInformation Gain表示を難易度に応じて隠し、プレイヤー自身に質問価値を学ばせる。

## 8. 学習システムへの接続点

質問には `grammarTags` がある。

```ts
grammarTags: [
  'WH_QUESTION',
  'PRESENT_PERFECT'
]
```

次段階ではこのタグを使い、遭遇回数・成功率・最終使用時刻を保存してSRSへつなぐ。

## 9. 次のMilestone

v0.2では通常接客と同じ「情報収集→判断」構造を使って、以下を追加する。

- 返品
- 在庫切れ
- クレーム

専用ミニゲームを別々に作らず、Eventも同一の会話/情報開示エンジン上で動かす。
