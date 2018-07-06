(function() {
  var Emitter, HandleMap, HandleWatcher, PathWatcher, binding, fs, handleWatchers, path;

  binding = require('../build/Release/pathwatcher.node');

  HandleMap = binding.HandleMap;

  Emitter = require('event-kit').Emitter;

  fs = require('fs');

  path = require('path');

  handleWatchers = null;

  HandleWatcher = (function() {
    function HandleWatcher(path) {
      this.path = path;
      this.emitter = new Emitter();
      this.start();
    }

    HandleWatcher.prototype.onEvent = function(event, filePath, oldFilePath) {
      var detectRename;
      if (filePath) {
        filePath = path.normalize(filePath);
      }
      if (oldFilePath) {
        oldFilePath = path.normalize(oldFilePath);
      }
      switch (event) {
        case 'rename':
          this.close();
          detectRename = (function(_this) {
            return function() {
              return fs.stat(_this.path, function(err) {
                if (err) {
                  _this.path = filePath;
                  if (process.platform === 'darwin' && /\/\.Trash\//.test(filePath)) {
                    _this.emitter.emit('did-change', {
                      event: 'delete',
                      newFilePath: null
                    });
                    return _this.close();
                  } else {
                    _this.start();
                    return _this.emitter.emit('did-change', {
                      event: 'rename',
                      newFilePath: filePath
                    });
                  }
                } else {
                  _this.start();
                  return _this.emitter.emit('did-change', {
                    event: 'change',
                    newFilePath: null
                  });
                }
              });
            };
          })(this);
          return setTimeout(detectRename, 100);
        case 'delete':
          this.emitter.emit('did-change', {
            event: 'delete',
            newFilePath: null
          });
          return this.close();
        case 'unknown':
          throw new Error("Received unknown event for path: " + this.path);
          break;
        default:
          return this.emitter.emit('did-change', {
            event: event,
            newFilePath: filePath,
            oldFilePath: oldFilePath
          });
      }
    };

    HandleWatcher.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    HandleWatcher.prototype.start = function() {
      var troubleWatcher;
      this.handle = binding.watch(this.path);
      if (handleWatchers.has(this.handle)) {
        troubleWatcher = handleWatchers.get(this.handle);
        troubleWatcher.close();
        console.error("The handle(" + this.handle + ") returned by watching " + this.path + " is the same with an already watched path(" + troubleWatcher.path + ")");
      }
      return handleWatchers.add(this.handle, this);
    };

    HandleWatcher.prototype.closeIfNoListener = function() {
      if (this.emitter.getTotalListenerCount() === 0) {
        return this.close();
      }
    };

    HandleWatcher.prototype.close = function() {
      if (handleWatchers.has(this.handle)) {
        binding.unwatch(this.handle);
        return handleWatchers.remove(this.handle);
      }
    };

    return HandleWatcher;

  })();

  PathWatcher = (function() {
    PathWatcher.prototype.isWatchingParent = false;

    PathWatcher.prototype.path = null;

    PathWatcher.prototype.handleWatcher = null;

    function PathWatcher(filePath, callback) {
      var stats, watcher, _i, _len, _ref;
      this.path = filePath;
      this.emitter = new Emitter();
      if (process.platform === 'win32') {
        stats = fs.statSync(filePath);
        this.isWatchingParent = !stats.isDirectory();
      }
      if (this.isWatchingParent) {
        filePath = path.dirname(filePath);
      }
      _ref = handleWatchers.values();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watcher = _ref[_i];
        if (watcher.path === filePath) {
          this.handleWatcher = watcher;
          break;
        }
      }
      if (this.handleWatcher == null) {
        this.handleWatcher = new HandleWatcher(filePath);
      }
      this.onChange = (function(_this) {
        return function(_arg) {
          var event, newFilePath, oldFilePath;
          event = _arg.event, newFilePath = _arg.newFilePath, oldFilePath = _arg.oldFilePath;
          switch (event) {
            case 'rename':
            case 'change':
            case 'delete':
              if (event === 'rename') {
                _this.path = newFilePath;
              }
              if (typeof callback === 'function') {
                callback.call(_this, event, newFilePath);
              }
              return _this.emitter.emit('did-change', {
                event: event,
                newFilePath: newFilePath
              });
            case 'child-rename':
              if (_this.isWatchingParent) {
                if (_this.path === oldFilePath) {
                  return _this.onChange({
                    event: 'rename',
                    newFilePath: newFilePath
                  });
                }
              } else {
                return _this.onChange({
                  event: 'change',
                  newFilePath: ''
                });
              }
              break;
            case 'child-delete':
              if (_this.isWatchingParent) {
                if (_this.path === newFilePath) {
                  return _this.onChange({
                    event: 'delete',
                    newFilePath: null
                  });
                }
              } else {
                return _this.onChange({
                  event: 'change',
                  newFilePath: ''
                });
              }
              break;
            case 'child-change':
              if (_this.isWatchingParent && _this.path === newFilePath) {
                return _this.onChange({
                  event: 'change',
                  newFilePath: ''
                });
              }
              break;
            case 'child-create':
              if (!_this.isWatchingParent) {
                return _this.onChange({
                  event: 'change',
                  newFilePath: ''
                });
              }
          }
        };
      })(this);
      this.disposable = this.handleWatcher.onDidChange(this.onChange);
    }

    PathWatcher.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    PathWatcher.prototype.close = function() {
      this.emitter.dispose();
      this.disposable.dispose();
      return this.handleWatcher.closeIfNoListener();
    };

    return PathWatcher;

  })();

  exports.watch = function(pathToWatch, callback) {
    if (handleWatchers == null) {
      handleWatchers = new HandleMap;
      binding.setCallback(function(event, handle, filePath, oldFilePath) {
        if (handleWatchers.has(handle)) {
          return handleWatchers.get(handle).onEvent(event, filePath, oldFilePath);
        }
      });
    }
    return new PathWatcher(path.resolve(pathToWatch), callback);
  };

  exports.closeAllWatchers = function() {
    var watcher, _i, _len, _ref;
    if (handleWatchers != null) {
      _ref = handleWatchers.values();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watcher = _ref[_i];
        watcher.close();
      }
      return handleWatchers.clear();
    }
  };

  exports.getWatchedPaths = function() {
    var paths, watcher, _i, _len, _ref;
    paths = [];
    if (handleWatchers != null) {
      _ref = handleWatchers.values();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        watcher = _ref[_i];
        paths.push(watcher.path);
      }
    }
    return paths;
  };

  exports.File = require('./file');

  exports.Directory = require('./directory');

}).call(this);
