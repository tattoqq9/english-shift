# English Shift 開発まとめ
最終更新: 2026-09-02

## 1. ゲームの核

**English Shift** は、英語を「問題として解く」のではなく、
**英語で店員として働く接客シミュレーションゲーム**を目指す。

中心ループ:

1. 客が英語で来店・要望を伝える
2. プレイヤーが質問する
3. 客が英語で返答する
4. Hidden情報（予算・用途・優先条件など）が判明する
5. 商品を比較する
6. 客に合う商品を推薦する
7. Match / Efficiency / Trust などで採点される
8. 客の表情・リアクション・演出で結果を返す
9. シフト途中に返品・在庫切れ・クレームなどのイベントが発生する
10. 1日の最後に結果・学習状況をまとめる

企画の中心思想:

> 英語を勉強するゲームではなく、英語ができるほど店員の仕事がうまくいくゲーム。

---

## 2. 学習面の基本方針

最終的には中学〜高校3年までの主要英文法を、
「文法問題」としてではなく **店員として必要な場面で自然に使わせる**。

例:

- 疑問詞 → 客のHidden情報を聞き出す
- 比較級 → 商品比較
- 現在完了 → 使用経験・トラブル確認
- 受動態 → 配送・製造・保証
- 関係代名詞 → 商品・人物の特定
- 過去完了 → 事件の時系列
- 助動詞 + 完了形 → 推理
- 仮定法 → クレーム・代替案・過去の失敗分析
- 間接話法 → 他スタッフへの情報伝達

文法を使わせるときに、
「現在完了を使え」のような直接指示は基本的に出さない。

ゲーム終了後・接客終了後に、

- 今の表現は何の文法だったか
- より自然な言い方
- 何が通じたか
- 何が改善できるか

をフィードバックする。

---

## 3. 現在の技術方針

Unity / Flutter は使わず、Web技術を中心にする。

### 採用方針

- React
- TypeScript
- Vite
- Zustand
- HTML / CSS
- JSONベースのデータ管理

### 配布展開

初期:
- Webブラウザ
- PWA

モバイル:
- Capacitor
- iOS / Android

将来:
- Tauri または Electron
- Steam

### 理由

このゲームは主に、

- 会話
- UI
- 商品カード
- 状態管理
- キャラクター画像
- 軽い2D演出
- 学習データ

が中心であり、3Dや重い物理演算を必要としない。

そのためWeb技術で十分な性能が期待できる。

また、

- URLですぐ遊べる
- スマホで気軽に試せる
- LLM/AIコーディングとの相性が良い
- iOS/Android/Steamへ同じコアを持ち回れる
- エンジンロイヤリティを気にしなくてよい

というメリットが大きい。

---

## 4. 現在の実装状況

### Version 0.1 系

すでに以下を実装済み。

#### 通常接客

- 客10人
- 商品15種類
- Customer Hidden情報
  - Budget
  - Purpose
  - Priority
  - Experience / User など
- 英語で質問
- 質問ごとの客の英語返答
- Hidden情報の開示
- Patience
- Trust
- 質問回数
- Information Gain
- 商品推薦
- Match Score
- Choice Quality
- Efficiency Bonus
- Day Result

### 推薦採点

固定の「正解商品ID」は持たない。

Customer Needs と Product Features の適合度から
Match Score を動的に計算する。

さらに、

- 絶対的な商品適合度
- 店内候補の中でどれだけ最適か

を分けて採点する。

最適な商品を選べば Choice Quality = 100 になる設計。

### Efficiency Bonus

最適商品を選び、かつ質問が少ないほど高得点。

例:

- 最適質問数 → +30
- +1問 → +20
- +2問 → +10
- それ以上 → +0

ただし、商品選択自体が悪ければEfficiency Bonusは与えない。

---

## 5. スクロール・操作感

スマホ実機で動作確認済み。

Windows PC上で:

```powershell
npx vite --host 0.0.0.0
```

同一LAN上のAndroidスマホからアクセス可能。

実装済みUI改善:

- Ask a question 後
  - 新しく追加された会話まで自動スクロール
- Recommend selected product 後
  - 結果欄まで自動スクロール
- Next customer 後
  - ページ最上部へスクロール
- 評価に応じた結果エフェクト
  - S: 強い成功演出 / 紙吹雪
  - A: ポップ / キラキラ
  - B: 軽いパルス
  - C: シェイク
- Reduced Motion対応

---

## 6. Customer Portrait

最初の3人:

- Mia
- Daniel
- Grace

について、ChatGPTでキャラクター画像を生成済み。

1キャラ6表情:

- neutral
- thinking
- happy
- confused
- delighted
- disappointed

実装済み:

- 質問のInformation Gainに応じて表情変化
- CSSモーション
  - nod
  - tilt
  - shake
  - pop
- 推薦評価に応じて最終表情変化
- 結果欄に客画像表示
- 評価に応じた英語リアクション

例:

S:
> That sounds perfect! It's exactly what I was looking for.

A:
> That sounds good.

B:
> I think this could work.

C:
> I'm not sure that's what I need...

残り7人は現状、文字アイコンへフォールバック。

---

## 7. イベントシステム

Version 0.1.3で以下を実装済み。

### イベント

1. Return Trouble
2. Out of Stock
3. Delivery Complaint

通常接客とは別ゲームにせず、
同じ「会話 → 情報取得 → 判断 → 評価」ループ上で動かす。

各イベント:

- 3ステップ
- 客の英語セリフ
- プレイヤーの選択
- 客の英語リアクション
- Score / Trust増減
- S / A / B / C評価
- 最後に文法解説

イベントデータは `src/data/events.ts` に分離。

将来追加候補:

- 迷子
- 盗難疑惑
- 予約ミス
- レジ故障
- 支払いトラブル
- VIP客
- スタッフのミス
- 商品破損
- 停電
- 緊急事態

---

## 8. 「選択式だけでは話せるようにならない」問題

重要な方針転換。

選択肢方式は初期学習には有効だが、
それだけでは実際に英語を「思い出して話す」力が弱い。

そのため入力方式を段階化する。

### Level 1: SEE / 選択

例:

- A. Have you tried restarting it?
- B. When did the problem start?
- C. You should buy a new pair.

目的:
- 正しい対応を認識する
- 英語表現に慣れる

### Level 2: BUILD / チャンク組み立て

例:

- [Have you]
- [tried]
- [restarting]
- [it?]

目的:
- 英文構造を自分で組み立てる
- Recallを少し要求する

### Level 3: RECALL / 制限語彙自由入力

当面の開発目標はここまで。

例:

客:
> I bought this yesterday, but it stopped working this morning.

プレイヤー:
> ______________________

ゲームで許可された語彙・表現の範囲内で、
自分で英文を入力する。

例:
> Have you tried restarting it?

目的:
- 模範文を見ずに英文を思い出す
- 実際の会話に近いRecall能力を鍛える

### 将来 Level 4

Sentence Embeddingを使ったより自由な入力。

### 将来 Level 5

音声入力。

ただし、現時点ではLevel 3までを目標とする。

---

## 9. LLMは使用しない

重要な方針。

### 理由

- スマホでは重い
- API費用を継続的に払えない
- 判定結果が揺れる
- オフライン性が下がる
- ゲーム側のルールをLLMに依存させたくない

そのため、
**LLMなしで成立するControlled English Engine**を目指す。

---

## 10. Controlled English Engine 構想

Level 3の自由入力を判定するため、
ゲーム内で使える英語を意図的に限定する。

### 基本構造

```text
Player Input
↓
Normalize
↓
Vocabulary Check
↓
Grammar Pattern Match
↓
Intent / Slot Match
↓
SUCCESS / PARTIAL / RETRY
```

将来のみ:

```text
↓
Sentence Embedding fallback
```

### Vocabulary制限

Chapter / Stageごとに使える単語を定義する。

例:

- have
- you
- try
- restart
- reconnect
- turn
- off
- on
- again
- receipt
- buy
- bought
- return
- problem
- work

辞書外の単語が使われた場合:

> “examined” is not in your current vocabulary.
> Try using words you have learned.

という形で拒否または言い換えを促す。

### ただし語形変化は吸収する

例:

- restart
- restarts
- restarted
- restarting

を同一のlemmaとして扱う。

同様に:

- buy / bought / buying
- try / tried / trying
- work / worked / working

など。

短縮形も正規化:

- don't → do not
- can't → cannot
- I'm → I am
- I'd → I would / I had

### スペルミス

Levenshtein distanceなどで軽微なスペルミスを検知。

例:

`restert`

→

> Did you mean "restart"?

---

## 11. 正解判定の考え方

「正解英文」と完全一致させない。

ゲーム上では、
**会話の目的を達成したか**で判定する。

例:

目的:

```text
ASK_RESTART_ATTEMPT
```

必要な意味:

```text
ASK + PREVIOUS_ATTEMPT + RESTART
```

許容例:

- Have you tried restarting it?
- Did you try restarting it?
- Have you restarted it?
- Did you restart it?
- Have you tried turning it off and on again?

全部ゲーム進行上は成功にできる。

### Intent + Slot

例:

```text
Intent:
ASK_PREVIOUS_ATTEMPT

Slots:
action = restart
```

これがシナリオ側の期待値と一致すれば成功。

### 文法とゲーム進行を分離

例:

> Have you restart it?

意味は通じる。

判定:

- Communication: SUCCESS
- Grammar: △
- Naturalness: △

ゲームは進める。

後から:

> More natural:
> Have you tried restarting it?

と教える。

---

## 12. Sentence Embeddingについて

将来のLevel 4候補。

スマホ・ブラウザ内でも実行可能性は高い。

候補技術:

- Transformers.js
- WASM
- WebGPU（検証済み端末のみ）
- 小型Sentence Embeddingモデル

用途:

**ルールや既知パターンで拾えなかったが、
意味的には正しそうな文章の救済判定。**

Embeddingだけで正誤判定はしない。

理由:

例:

- Have you tried restarting it?
- You should try restarting it.

意味は近いが、
ゲーム上は

- 前者: 質問
- 後者: 提案

で違う。

したがって将来は:

```text
Vocabulary
+
Grammar Pattern
+
Intent / Slot
+
Sentence Embedding
```

を組み合わせる。

正解側のEmbeddingは事前計算しておき、
スマホではプレイヤー入力だけ計算する案も有効。

ただし当面はSentence Embeddingを実装しない。

---

## 13. 「使える英語」をゲームシステムにする案

制限語彙は単なる技術的制約ではなく、
ゲーム性に変換できる。

プレイヤーのVocabularyとして、

- check
- try
- restart
- receipt
- refund
- replacement

などを持つ。

ゲーム進行で:

```text
NEW WORD UNLOCKED!
refund

NEW PHRASE UNLOCKED!
Could you...
```

のように解禁する。

最初:

> Check receipt.

成長後:

> Could I check your receipt, please?

さらに:

> Would you mind showing me your receipt?

というように、
語彙・文法・丁寧表現の解禁そのものを成長要素にできる。

---

## 14. 当面の開発目標

### 目標: Level 3まで

1. Level 1
   - 選択式
2. Level 2
   - チャンク組み立て
3. Level 3
   - 制限語彙自由入力

ここまでをまず完成させる。

### 次の実装優先度

1. 既存イベント1つを
   - 選択式
   - チャンク式
   - 制限語彙自由入力
   の3方式で遊べるようにする

2. Controlled English Engine v1
   - Normalize
   - Vocabulary Check
   - 短縮形展開
   - lemma化
   - Grammar Pattern
   - Intent / Slot
   - SUCCESS / PARTIAL / RETRY

3. 自由入力失敗時のゲーム演出
   - Customer:
     > Sorry, I'm not sure what you mean.
   - 再入力
   - Hint
   - 必要ならチャンク表示

4. プレイヤーVocabularyの管理
   - 解禁語彙
   - 解禁Phrase
   - Chapterごとの使用可能語彙

5. 学習進行との連動
   - 習熟した表現ほど選択肢を減らす
   - 選択 → BUILD → RECALLへ昇格する

---

## 15. 長期的な理想形

```text
SEE
選択肢を見る
↓
BUILD
英文を組み立てる
↓
RECALL
制限語彙で自力入力
↓
将来:
より自由な入力
↓
将来:
SPEAK
実際に話す
↓
AUTOMATIC
考えなくても英語が出てくる
```

English Shiftの目標:

> ゲームを進めるにつれて「問題が難しくなる」のではなく、
> 英語の補助が少しずつ消え、
> 最後には自分の英語で接客できるようになる。

---

## 16. Windows開発メモ

プロジェクト例:

```text
D:\26_English_shift\english-shift-v01\english-shift-v01
```

起動:

```powershell
npx vite --host 0.0.0.0
```

同一LANのAndroidスマホから、
Viteが表示するNetwork URLへアクセスして実機確認できる。

パッチ適用用:

```text
apply-patch.ps1
```

今後パッチZIPは基本的にプロジェクトルート基準で作る。

適用例:

```powershell
.\apply-patch.ps1 "$env:USERPROFILE\Downloads\english-shift-vXXX-patch.zip" -RunChecks
```

---

## 17. 現時点での重要な設計判断まとめ

- Unityは使わない
- Flutterも現時点では使わない
- Web-first
- React + TypeScript + Vite
- iOS/AndroidはCapacitor候補
- SteamはTauri/Electron候補
- LLMは使わない
- 当面Sentence Embeddingも使わない
- Level 3「制限語彙自由入力」までをまず完成させる
- ゲーム側が扱える英語世界を意図的に制限する
- 正解英文完全一致ではなくIntent / Slotで判定する
- 文法ミスと会話成功を分離する
- 語彙制限そのものをゲームの成長要素にする
- Customerリアクション・表情・アニメーションを重視する
- 学習より先にゲームとしての気持ちよさを維持する
