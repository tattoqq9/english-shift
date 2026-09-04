English Shift v0.1.3 Event System patch

既存の v0.1.2 プロジェクト直下へ、このZIPの内容を上書きコピーしてください。

追加されるイベント:
- Return Trouble: Customer 2後
- Out of Stock: Customer 5後
- Delivery Complaint: Customer 8後

確認:
  npm run core:check
  npm run dev -- --host

もし npm の --host 解釈で警告が出る環境では:
  npx vite --host 0.0.0.0
