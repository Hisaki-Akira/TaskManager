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

## Firebase統合

### 認証機能
- Email/Passwordでのサインアップ・ログイン
- 認証状態の管理（onAuthStateChanged）
- ログアウト機能

### データ永続化
- Firestore を使用したリアルタイムデータ同期
- ユーザー情報とタスクをクラウドに保存
- マルチユーザー対応

## セットアップ

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト設定から「ウェブアプリ」を追加
4. Firebase SDKの設定情報をコピー

### 2. Firebase設定の更新

`index.html` の `firebaseConfig` を以下のように更新してください：

```javascript
const firebaseConfig = {
  apiKey: "あなたのAPIキー",
  authDomain: "プロジェクトID.firebaseapp.com",
  projectId: "プロジェクトID",
  storageBucket: "プロジェクトID.appspot.com",
  messagingSenderId: "送信者ID",
  appId: "アプリID"
};
```

### 3. Firebase Authentication の設定

1. Firebase Console で「Authentication」を選択
2. 「Sign-in method」タブを開く
3. 「Email/Password」を有効化

### 4. Firestore Database の設定

1. Firebase Console で「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. 本番環境モードを選択
4. ロケーションを選択（asia-northeast1 推奨）

### 5. Firestoreセキュリティルールの設定

Firestore のルールタブで以下のセキュリティルールを設定してください：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーコレクション
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
    
    // タスクコレクション
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.createdBy == request.auth.uid;
      allow delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }
  }
}
```

## 使い方

### ローカル環境で実行

```bash
# HTTPサーバーを起動
python3 -m http.server 8080

# ブラウザで開く
open http://localhost:8080
```

### 初回利用時

1. ブラウザでアクセス
2. 「サインアップに切り替え」をクリック
3. メールアドレスとパスワード（6文字以上）を入力
4. 「サインアップ」をクリック
5. 自動的にログインされ、スケジューラー画面が表示されます

### タスクの追加

1. 「+ タスク追加」ボタンをクリック
2. タスク名、担当者、開始日、終了日を入力
3. 「追加」をクリック

または

1. タイムライン上の空白部分をクリック
2. その人とその日付が自動入力された状態でモーダルが開きます

### タスクの削除

1. タスクブロックをクリック
2. 「削除」ボタンをクリック

## Firestoreデータ構造

### Usersコレクション (`users/{userId}`)

```javascript
{
  userId: string,        // Firebase Auth UID
  email: string,         // ユーザーのメールアドレス
  displayName: string,   // 表示名（メールアドレスから自動生成）
  color: string,         // ユーザーカラー（ランダム割り当て）
  createdAt: Timestamp   // アカウント作成日時
}
```

### Tasksコレクション (`tasks/{taskId}`)

```javascript
{
  id: string,            // ドキュメントID（自動生成）
  title: string,         // タスク名
  assignedTo: string,    // 担当者のuserId
  createdBy: string,     // 作成者のuserId
  startDate: string,     // 開始日 (YYYY-MM-DD)
  endDate: string,       // 終了日 (YYYY-MM-DD)
  color: string,         // 担当者のカラー
  createdAt: Timestamp,  // 作成日時
  updatedAt: Timestamp   // 更新日時
}
```

## データモデル（アプリケーション内部）

```typescript
interface User {
  id: string;
  name: string;
  color: string;
  email: string;
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

## 一目で分かること

このツールを使うと、以下の質問に一目で答えられます：

- ✅ **この人は来週空いてる？** → ユーザー行を見る
- ✅ **一番余裕があるのは誰？** → 稼働率%を比較
- ✅ **ボトルネックは？** → 赤い稼働率 + ⚠️マークを探す
- ✅ **この日に何が走ってる？** → 縦に日付列を見る

## 技術スタック

- **React 18.2.0** - UIライブラリ
- **Firebase 9.22.0** - 認証とデータベース
  - Firebase Authentication - ユーザー認証
  - Firestore - リアルタイムデータベース
- **インラインスタイル** - シンプルさ優先
- **ESM/UMD** - ビルドツール不要

## 設計判断

1. **タスク重複を許可** - 過負荷を視覚化するため
2. **1タスク = 1ユーザー** - シンプルなデータモデル
3. **空白 = 空き時間** - 直感的な判断を優先
4. **色での警告** - 数値だけでなく視覚的に即座に判断可能
5. **タスクの縦積み** - 重複タスクを見やすく表示
6. **リアルタイム同期** - Firestoreによる自動データ同期

## セキュリティに関する注意

- Firestoreセキュリティルールを必ず設定してください
- 本番環境では、環境変数や秘密管理システムでFirebase設定を管理することを推奨します
- クライアント側のバリデーションに加え、Firestoreルールでもデータを保護してください

## トラブルシューティング

### ログインできない
- Firebase Authenticationが有効になっているか確認
- Email/Passwordプロバイダーが有効になっているか確認
- ブラウザのコンソールでエラーメッセージを確認

### データが表示されない
- Firestoreが作成されているか確認
- セキュリティルールが正しく設定されているか確認
- 認証が成功しているか確認

### "Permission denied" エラー
- Firestoreセキュリティルールを確認
- 認証済みユーザーでログインしているか確認

## ライセンス

MIT