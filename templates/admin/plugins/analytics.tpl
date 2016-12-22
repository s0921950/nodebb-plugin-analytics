<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading">Sample Admin Page</div>
			<div class="panel-body">
				<form role="form" class="analytics-settings">
					<p>
						Adjust these analytics settings. 
					</p>
					<div class="checkbox">
						<label for="activate_analytic" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
							<input type="checkbox" class="mdl-switch__input" id="activate_analytic" data-field="activate_analytic" name="activate_analytic" />
							<span class="mdl-switch__label">Activate analytics</span>
						</label>
					</div>
					<div class="form-group">
						<label for="api_url">API URL</label>
						<input type="text" id="api_url" name="api_url" title="API URL" class="form-control" placeholder="API URL">
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
	$(document).ready(function() {
		console.log('nodebb-plugin-analytics: loaded');
	});
	require(['settings'], function(Settings) {
		Settings.load('analytics', $('.analytics-settings'));
		$('#save').on('click', function() {
			Settings.save('analytics', $('.analytics-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'analytics-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
				});
			});
		});
	});
</script>