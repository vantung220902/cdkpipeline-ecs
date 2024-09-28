#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { CdkPipelineEcsStack } from '../lib/cdk-pipeline-ecs-stack';

const app = new cdk.App();
new CdkPipelineEcsStack(app, 'PipelineEcsStack', {
  env: { region: 'ap-southeast-1', account: '242324814550' },
});
app.synth();
