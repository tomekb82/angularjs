/* tslint:disable:max-line-length */
module login {
  export var html = '<div>    <div class="row">        <div class="col-md-4 col-md-offset-4">            <h1 translate="login.title">Authentication</h1>            <div class="alert alert-danger" ng-show="authenticationError" translate="login.messages.error.authentication">                <strong>Authentication failed!</strong> Please check your credentials and try again.            </div>            <form class="form" role="form" ng-submit="login($event)">                <div class="form-group">                    <label for="username" translate="global.form.username">Login</label>                    <input type="text" class="form-control" id="username" placeholder="{{\'global.form.username.placeholder\' | translate}}" ng-model="username">                </div>                <div class="form-group">                    <label for="password" translate="login.form.password">Password</label>                    <input type="password" class="form-control" id="password" placeholder="{{\'login.form.password.placeholder\' | translate}}"                           ng-model="password">                </div>                <div class="form-group">                    <label for="rememberMe">                        <input type="checkbox" id="rememberMe" ng-model="rememberMe" checked>                        <span translate="login.form.rememberme">Automatic Login</span>                    </label>                </div>                <button type="submit" class="btn btn-primary" translate="login.form.button">Authenticate</button>            </form>            <p></p>            <div class="alert alert-warning">                <a href="#/reset/request" translate="login.password.forgot">Did you forget your password?</a>            </div>            <div class="alert alert-warning" translate="global.messages.info.register">                You don\'t have an account yet? <a href="#/register">Register a new account</a>            </div>        </div>    </div></div>';
}
