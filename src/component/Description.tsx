import React from 'react'

type DescriptionProps = {
  onClose: () => void
}

const Description: React.FC<DescriptionProps> = ({ onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-pink-500">
        おかしにっきとは？
      </h2>
      <p className="text-gray-700">
        ダイエット＆節約したい人向け！
        <br />
        毎日のお菓子の記録を付けるアプリ
        <br />
        【使い方】
        <br />
        ①ログインして、月の目標を設定する
        <br />
        ②記録したい日付をクリックして詳細を入力
        <br />
        ③目標を超えないようにしながらお菓子生活を楽しもう！
        <br />
      </p>
      <button
        className="mt-4 px-4 py-2 bg-pink-100 text-white rounded-lg hover:bg-pink-200"
        onClick={onClose}
      >
        閉じる
      </button>
    </div>
  </div>
)

export default Description
