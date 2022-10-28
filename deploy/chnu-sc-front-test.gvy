pipeline { 
    agent any 
    parameters {
        gitParameter branchFilter: 'origin/(.*)', defaultValue: 'chnu', selectedValue: 'DEFAULT', name: 'BRANCH_TAG', type: 'PT_BRANCH_TAG', sortMode: 'DESCENDING_SMART', listSize: '10' , description: '请选择要构建的分支或tag'
    }   
    environment {
        SKIP_BUNDLING = true

        //发送到通知群
        ROBOT_URL = 'https://oapi.dingtalk.com/robot/send?access_token=cd22631091403d61555cf404c2321ce028f71ba304897b8c34760bdc59dbfc62'
        
        //项目代码首页地址
        GIT_URL = "https://codeup.aliyun.com/60813db3429bb594fdddcd87/front/scientific-training-web"

        //项目的访问地址(域名)
        URL_DOMAIN = 'http://chnusc.mycloudedu.net'

        //目标机的名称,需事先在Jenkins系统设置中设置
        PUB_TARGET = 'test_front_01_1.141'

        //构建机上的工作目录
        REMOTE_DIRECTORY = "/data/deploy/test/frontend/chnu-sc"

        //部署机上的工作目录
        REMOTE_DIRECTORY_2 = "/data/projects/chnu-sc/"

        //构建机上要执行的命令,如有多个,用分号";"隔开
        EXEC_COMMAND = "build_push.sh ${params.BRANCH_TAG}"

        //部署机上要执行的命令,如有多个,用分号";"隔开
        EXEC_COMMAND_2 = "update.sh ${params.BRANCH_TAG}"

        //相对于工作目录与目标文件之间的路径,如需要传输的文件为 api/target/xxxxx.jar则,取jar包名之前的部分.写相对于workspace的路径.
        REMOVE_PREFIX = ' '
        FILES = ' '
    }

    options {
        // 不允许同时执行流水线
        disableConcurrentBuilds()
        // 显示具体的构建流程时间戳
        timestamps()
    }

    stages { 
        stage('Git Checkout') {
            steps {
                checkout([$class: 'GitSCM', 
                          branches: [[name: "${params.BRANCH_TAG}"]], 
                          doGenerateSubmoduleConfigurations: false, 
                          extensions: [], 
                          gitTool: 'Default', 
                          submoduleCfg: [], 
                          userRemoteConfigs: [[url: 'git@codeup.aliyun.com:60813db3429bb594fdddcd87/front/scientific-training-web.git']]
                        ])
                sh "rm -fr ${REMOTE_DIRECTORY}/code/"
                sh "cp -a ../chnu-sc-front-test ${REMOTE_DIRECTORY}/code/"
                sh "rm -fr ${REMOTE_DIRECTORY}/code/.git"
                sh "${REMOTE_DIRECTORY}/${EXEC_COMMAND}"
            }
        }        
        stage('Deploy'){
            steps {
                sshPublisher(publishers: [sshPublisherDesc(configName: "${PUB_TARGET}", 
                transfers: [sshTransfer(excludes: '', 
                execCommand: "bash ${REMOTE_DIRECTORY_2}${EXEC_COMMAND_2}", 
                execTimeout: 600000, 
                flatten: false, 
                makeEmptyDirs: true, 
                noDefaultExcludes: false, 
                patternSeparator: '[, ]+', 
                remoteDirectory: "${REMOTE_DIRECTORY_2}", 
                remoteDirectorySDF: false, 
                removePrefix: "${REMOVE_PREFIX}", 
                sourceFiles: "${REMOVE_PREFIX}${FILES}")],usePromotionTimestamp: false, 
                useWorkspaceInPromotion: false, 
                verbose: true)]) 
            }
        }
    }
    post {
        success {
            script {
                def rawmsg = successNotifyData()
                changes = getChanges()
                sh "curl -H 'Content-Type:application/json' -X POST --data '${rawmsg}' ${ROBOT_URL}"
            }
        }

        failure {
            script {
                def rawmsg = failNotifyData()
                changes = getChanges()
                sh "curl -H 'Content-Type:application/json' -X POST --data '${rawmsg}' ${ROBOT_URL}"
            }
        }
    }
}

def failNotifyData() {
  def title = "${currentBuild.fullDisplayName} \n # <font color=#FF0000 >构建失败!!![费解]</font>"
  def markdown = "### ${title}\n #### Branch: \n > ${BRANCH_TAG} \n\n #### 已获取更新内容: \n ${changes} \n\n #### 摘要: \n > [构建日志](${BUILD_URL}console) \n\n > [变更记录](${JOB_URL}changes) \n\n > [构建主页](${BUILD_URL}) \n\n > 运行时间: ${currentBuild.durationString}"
  return buildJSON(title, markdown)
}

def successNotifyData() {
  def title = "${currentBuild.fullDisplayName} \n # <font color=#00EC00 >构建成功!  [烟花][烟花][烟花]</font>"
  def markdown = "### ${title}\n #### Branch: \n > ${BRANCH_TAG} \n\n #### 更新内容: \n ${changes} \n\n #### 摘要: \n > [构建日志](${BUILD_URL}console) \n\n > [变更记录](${JOB_URL}changes) \n\n > [构建主页](${BUILD_URL}) \n\n > 运行时间: ${currentBuild.durationString} \n\n > 访问地址: [${URL_DOMAIN}](${URL_DOMAIN})"
  return buildJSON(title, markdown)
}

def buildJSON(title, markdown) {
  return """
  {
    "msgtype": "markdown",
    "markdown": {
      "title":"${title}",
      "text":"${markdown}"
    }
  }
  """
}

@NonCPS
def getChanges()
{
    MAX_MSG_LEN = 100
    def changeString = ""
    def changeLogSets = currentBuild.changeSets
    for (int i = 0; i < changeLogSets.size(); i++) 
    {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++)
        {
            def entry = entries[j]
            def change_msg = entry.msg.take(MAX_MSG_LEN)
            def change_author = entry.author
            def change_commitId = entry.commitId
            changeString += " > ${change_msg} \n\n > —— ${change_author}/[查看](${GIT_URL}/commit/${change_commitId}) \n\n --- \n\n"
        }
    }
    if (!changeString)
    {
        changeString = " > No changes \n\n --- \n\n"
    }
    return changeString  
}