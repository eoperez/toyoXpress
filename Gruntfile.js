module.exports = function (grunt) {
    // load all grunt tasks
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
    });
    
    // BCLCCU-10: define core libs.
    var projectPKG = grunt.file.readJSON('package.json');
    var coreLibs = Object.keys(projectPKG.dependencies);
    
    // Add any dependencies manually, uncomment if become necesary
    // coreLibs.push('');
    
    // Checks if the file shouls be copied to target
    function isCoreLib(filepath) {
        // check of the filepath contains any of the dependencies.
        if (coreLibs.some(function (v) { return filepath.indexOf(v) == 13; })) // [node_modules/] has 13 characters
        {
            // debugs file included using: grunt --debug ...
            grunt.log.debug(filepath + ' included');
            return true;
        } else {
            return false;
        }
    }
    
    // Grunt Config
    grunt.initConfig({
        pkg: projectPKG,
        ts: {
            compile: {
                src: ['src/services/**/*.ts', 'src/app.ts', '!src/**/*.d.ts', '!src/node_modules/**/*.ts', '!src/tests/**/*.ts'],
                options: {
                    verbose: true,
                    target: 'es5',
                    module: 'commonjs',
                    sourceMap: false,
                    declaration: false,
                    removeComments: true
                }
            },
            compileTests: {
                src: ['src/tests/**/*-specs.ts'],
                options: {
                    module: 'commonjs',
                    verbose: true,
                    sourceMap: false,
                    removeComments: true
                }
            }
        },
        sass: {
            options: {
                includePaths: ['src/public/vendor/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    sourceMap: true,
                },
                files: [{
                    expand: true,
                    cwd: 'src/public/',
                    src: ['**/*.scss'],
                    dest: 'dist/public/',
                    ext: '.css'
                }]
            }
        },
        copy: {
            server: {
                expand: true,
                cwd: 'src/',
                src: ['services/**/*.js', 'views/**', 'app.js', '!tests/**', '!public/**', '!**/*.ts'],
                dest: 'dist/'
            }
        },
        env: {
            options: {
                NODE_CONFIG_DIR: './target/config'
            },
            dev: {
                NODE_ENV: 'development',
            }
        },
        clean: {
            tests: {
                src: ['src/tests/**/**.js', 'tests/**/**', '_SpecRunner.html']
            },
            testsSrc: {
                src: ['src/tests/**/**.js', 'src/public/**/*-specs.js', 'src/public/**/*-specs.js.map']
            },
            serverSrc: {
                src: ['src/routes/**/**.js', 'src/models/**/**.js', 'src/*.js', 'src/bin/**.js', 'src/helpers/**/*.js', 'src/services/**/*.js']
            },
            clientAppsSrc: {
                src: ['src/public/apps/**/**.js', 'src/public/apps/**/**.js.map', 'src/public/components/**/**.js', 'src/public/components/**/**.js.map', 'src/public/model/**/*.js', 'src/public/model/**/*.js.map']
            },
            targetClients: {
                src: ['target/public/**']
            },
            target: {
                src: ['target/**', '.tscache/**']
            },
            globalStyles: {
                src: ['src/public/style/**.css', 'src/public/style/**.css.map']
            }
        }
    });
    /* TASK LOADED
     * grunt.loadNpmTasks('grunt-contrib-clean');
     * grunt.loadNpmTasks('grunt-contrib-copy');
     * grunt.loadNpmTasks('grunt-contrib-watch');
     * grunt.loadNpmTasks('grunt-contrib-jasmine');
    */

    // generates the logs to avoid issues with LogIO
    grunt.registerTask('createLogs', 'Creates an empty files for logs', function () {
        var logDir = 'target/logs/';
        var requiredLogs = ['app-error.log', 'app-debug.log', 'app-info.log', 'node_console_log.log'];
        for (var index = 0; index < requiredLogs.length; index++) {
            if (!grunt.file.exists(logDir + requiredLogs[index])) {
                grunt.file.write(logDir + requiredLogs[index]);
            }
        }
    });
    // tasks
    grunt.registerTask('compile', ['ts:compile']);

};