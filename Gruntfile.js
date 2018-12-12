module.exports = function (grunt) {
    var conf=grunt.file.readJSON('./conf.json');
    grunt.loadNpmTasks('grunt-replace');
    grunt.initConfig({
        replace: {
            dist:
            {
                options: {
                    patterns: [
                        {
                            json: grunt.file.readJSON('conf.json')
                        }
                    ]
                },
                files: [
                    {src: ['web/config/L_System_Config.js'], dest: 'web/config/System_Config.js'}
                ]
            }
        }

    });
    grunt.registerTask('default', 'replace');
};
