node {
    def user = ' '
    wrap([$class: 'BuildUser']) {
      user = env.BUILD_USER
    }

    def job_names = "$JOB_NAME".split('-')
    if (job_names.size() != 2) {
      println("job的名字必须是 项目名-服务名格式， 有且仅有一个-")
    }
    def project = job_names[0]
    def service = job_names[1]
    def version = "$BRANCH"
    if (version.split('/').size() != 1) {
      version = "0.0.${BUILD_NUMBER}"
    }

    def docker_image = "registry.enbrands.com/${project}/${service}:${version}-${build_parameter}"
    def docker_name = "${JOB_NAME}".replace(".", "_")
    def opts = "tag:${BRANCH},build_parameter:${build_parameter},deploy_env:${deploy_env},docker_image:${docker_image}"
    try {
        stage('Check out') {
            checkout scm
        }
        // maven 代码构建
        stage('Install&&Build') {
            sh("npm install -g yarn")
            sh("yarn install")
            sh("yarn build")
        }

        // docker 镜像构建 push
        stage('Docker build') {
            sh("docker -H tcp://127.0.0.1:2376 build -t ${docker_image} .")
            sh("docker -H tcp://127.0.0.1:2376 push ${docker_image}")
        }

        stage('Deploy') {

           //定义部署机器
           def deployNodes = [
             'zk-test': ['114.67.94.229'],
           ]
           def node = []
           if(deploy_env in deployNodes) {
              node = deployNodes[deploy_env]
           }
           for(IP in node ) {
             try {
               sh("ssh ${IP} docker rm -f ${docker_name}")
             }  catch (err) {
               echo "not exist old contains"
             }
             sh("ssh ${IP} docker run -d --name ${docker_name} ${docker_image}")
             if( deploy_env == "zk-test") {

               sh("ssh ${IP} rm -rf /data/web/buried-points-web_old")
               sh("ssh ${IP} mv /data/web/buried-points-web /data/web/buried-points-web_old")
               sh("ssh ${IP} docker cp ${docker_name}:/data/ /data/web/buried-points-web")
             }
             sh("ssh ${IP} docker rm -f ${docker_name}")
           }
        }
        stage('Cleanup') {
            try {
                sh("docker -H tcp://127.0.0.1:2376 rmi ${docker_image}")
            } catch (err) {
                echo "清理失败"
            }

        }
    } catch (err) {
        sh("bash /var/jenkins_home/dingding/enbrands/printdingding.sh ${user} ${JOB_NAME} '${opts}' failure")
        currentBuild.result = "FAILURE"
        throw err
    }
    sh("bash /var/jenkins_home/dingding/enbrands/printdingding.sh ${user} ${JOB_NAME} '${opts}' success")
    currentBuild.result = "SUCCESS"
}
