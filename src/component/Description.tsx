import React from 'react'

type DescriptionProps = {
  onClose: () => void
}

const Description: React.FC<DescriptionProps> = ({ onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-pink-500">
        おかしにっきとは？
      </h2>
      <p className="text-gray-700">
        おかしにっきは、お菓子の価格やカロリー、味の感想を記録するための日記帳アプリです。日付の上にあるピンクのアイコンを押すと、その日に食べたお菓子の情報を入力できます。また、目標部分から月の目標も設定可能です。
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
