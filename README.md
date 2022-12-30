# scrapandtweet

- firebase の以下の機能を使う
  - `functions`
    - デザイン関連の RSS をスクレイピングし、 `firestore` に保存する
    - `firestore` に保存したデータを元に Twitter Bot を通して、ツイートする
  - `firestore`
    - デザイン関連の RSS データを保存する

## 環境

### グローバル

|                |         |
| :------------: | :-----: |
|    Node.js     | 16.17.0 |
|      npm       | 8.15.0  |
| firebase-tools | 11.17.0 |

## コマンド

- プロジェクトルートの `package.json`
  - `functions` 配下の `package.json` のコマンドを実行するようになっている

### プロジェクト初期化

- firebase の CLI ツールを指定してインストール
  - [Unexpected Error while deploying using "firebase deploy --only functions" in firebase-tools@11.8.0 (latest version) (Could not find functions.yaml. Must use http discovery). · Issue #4952 · firebase/firebase-tools](https://github.com/firebase/firebase-tools/issues/4952)
  - `npm install -g firebase-tools@11.17.0`
- Local Emulator Suite を初期化する
  - `firebase init` で emulator の設定をする

### 開発時

- `npm run build`
  - プロジェクトビルド
- `npm run serve`
  - 開発用のエミュレーター起動
- `npm run deploy`
  - デプロイ
- `npm run emulator-config`
  - デプロイ先に保存した環境変数をローカルにも置く

### トラブルシューティング

- `The operation couldn’t be completed. Unable to locate a Java Runtime.`
  - Apple Silicon の Mac の場合、 `openjdk` をインストールしても Java が起動しないケースがあるため、Java を別途インストールする必要がある
    - [M1 Mac で Java が実行できない時の対処方法 | tamocolony](https://tamocolony.com/tech/apple/m1-mac-java-jdk/)
    - [Java Download | Java 7, Java 8, Java 11, Java 13, Java 15, Java 17, Java 19 - Linux, Windows & macOS](https://www.azul.com/downloads/?os=macos&architecture=arm-64-bit&package=jdk#download-openjdk)
- `Error: spawn ./node_modules/.bin/firebase-functions ENOENT`
  - 現状、 `firebase-tools` のバージョンを `11.17.0` にするのが無難そう
  - [Unexpected Error while deploying using "firebase deploy --only functions" in firebase-tools@11.8.0 (latest version) (Could not find functions.yaml. Must use http discovery). · Issue #4952 · firebase/firebase-tools](https://github.com/firebase/firebase-tools/issues/4952)
- すでにポートが使われているか、ポート番号が空いていない警告が出る場合
  - `sudo lsof -i:ポート番号` でポート番号の使用状況を確認する
  - すでに使用されている場合、 `kill ポート番号` で開放する
