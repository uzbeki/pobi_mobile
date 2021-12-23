1.  git clone(git clone https://github.com/uzbeki/pobi_mobile.git)

2. 「.env」ファイルをプロジェクト直下に作成する
   - 「GOOGLE_MAPS_API_KEY="KEYはプロジェクト管理者に聞いてください"」を記入
3. amplify pull を実行（前提条件：npm install -g @aws-amplify/cliはしている）
   - > AWS access keys (未作成の場合はプロジェクト管理者に相談してください)
   - region 
     > ap-northeast-1
   - Which app are you working on?
     > PobiMobile (d2948lspg8gnau)   
   - Source Directory Path:
     >./
   - Distribution Directory Path:
     > ./
   - Do you plan on modifying this backend? (Y/n) 
     >Y  
4. npm installを実行
5. expo startを実行