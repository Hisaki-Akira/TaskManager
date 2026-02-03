# リソーススケジューラー

人間がスケジューリング判断をしやすいタスク管理ツール。
複数ユーザーの稼働状況を一目で把握できるスケジューラー。

## 機能

### 視覚的な判断支援
- **稼働率表示**: 各ユーザーの稼働率を%で表示
- **色分け**: 
  - 0-50%: 緑（余裕あり）
  - 51-80%: 黄（適正）
  - 81-100%: 赤（過負荷）
- **重複警告**: タスクが重複している場合は⚠️マークで警告

### インタラクション
- **タスクブロッククリック**: タスクの詳細表示・削除
- **空白クリック**: その人・その日でタスク追加（日付がプリフィル）
- **表示期間切り替え**: 2週間/1ヶ月/3ヶ月
- **+ タスク追加ボタン**: 任意のタスクを追加

### レイアウト
- **左サイドバー**: ユーザー情報（固定200px）
  - ユーザー名
  - カラーインジケーター
  - 稼働率（色分け）
  - タスク数
  - 重複警告
- **タイムラインエリア**: 横スクロール対応
  - 日付ヘッダー（sticky固定）
  - 今日のハイライト（黄色）
  - 週末の色分け（グレー）
  - タスクブロック（期間表示）

## 実装詳細

### ファイル構成

```
TaskManager/
├── index.html              # メインHTMLファイル（スタンドアロン版）
├── README.md               # このファイル
└── src/                    # TypeScript版ソースコード
    ├── App.tsx
    ├── types.ts
    ├── mockData.ts
    ├── components/
    │   ├── TimelineHeader.tsx
    │   ├── UserRow.tsx
    │   ├── TaskBlock.tsx
    │   └── AddTaskModal.tsx
    └── utils/
        ├── dateUtils.ts
        └── workloadUtils.ts
```

### データモデル

```typescript
interface User {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  userId: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;
  color?: string;
}

interface UserWorkload {
  userId: string;
  utilization: number;
  taskCount: number;
  hasOverlap: boolean;
}

type ViewMode = 'week' | 'month' | 'quarter';
```

## 使い方

### 方法1: スタンドアロン版（index.html）

**注意**: `index.html`はReact CDN経由で動作します。インターネット接続が必要です。

```bash
# HTTPサーバーを起動
python3 -m http.server 8080

# ブラウザで開く
open http://localhost:8080
```

または、単にindex.htmlをブラウザで開く（ただし、セキュリティ制限により一部機能が動作しない場合があります）。

### 方法2: TypeScript版（開発用）

TypeScript版のソースコードは`src/`ディレクトリにあります。
ビルドツールを使用する場合は、以下のようなセットアップが必要です：

```bash
# Viteを使う例
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

## モックデータ

アプリケーションには4人のユーザーと8つのタスクが含まれています：

### ユーザー
1. **田中** - 通常負荷シナリオ
2. **佐藤** - 重複あり（過負荷シナリオ）
3. **鈴木** - 余裕ありシナリオ
4. **高橋** - 高負荷シナリオ

### タスク例
- プロジェクトA設計
- レビュー対応
- バグ修正
- テスト実施
- ドキュメント作成
- 要件定義
- プロジェクトB実装
- プロジェクトC実装

## 一目で分かること

このツールを使うと、以下の質問に一目で答えられます：

- ✅ **この人は来週空いてる？** → ユーザー行を見る
- ✅ **一番余裕があるのは誰？** → 稼働率%を比較
- ✅ **ボトルネックは？** → 赤い稼働率 + ⚠️マークを探す
- ✅ **この日に何が走ってる？** → 縦に日付列を見る

## 技術スタック

- **React 18.2.0** - UIライブラリ
- **TypeScript** - 型安全性
- **インラインスタイル** - シンプルさ優先
- **ESM/UMD** - ビルドツール不要

## 設計判断

1. **タスク重複を許可** - 過負荷を視覚化するため
2. **1タスク = 1ユーザー** - シンプルなデータモデル
3. **空白 = 空き時間** - 直感的な判断を優先
4. **色での警告** - 数値だけでなく視覚的に即座に判断可能
5. **タスクの縦積み** - 重複タスクを見やすく表示

## ライセンス

MIT