import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ECSStack } from './ecs-stack';
import { VpcStack } from './infra-stack';

export class AppStacks extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const vpcStack = new VpcStack(this, 'VPCStack', { env: props?.env });

    const ecsStack = new ECSStack(this, 'ECSStack', {
      env: props?.env,
      vpc: vpcStack.vpc,
    });
  }
}

export class CdkPipelineEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new cdk.pipelines.CodePipeline(this, 'Pipeline', {
      synth: new cdk.pipelines.ShellStep('Synth', {
        input: cdk.pipelines.CodePipelineSource.connection(
          'vantung220902/cdkpipeline-ecs',
          'develop',
          {
            connectionArn:
              'arn:aws:codestar-connections:ap-southeast-1:242324814550:connection/0fa70cab-7c85-4f86-a134-1d6365d99c1b',
          },
        ),
        commands: ['npm install', 'npx cdk synth'],
      }),
      selfMutation: true,
    });

    const wave = pipeline.addWave('DeployWave');

    wave.addStage(
      new AppStacks(this, 'AppsAsia', {
        env: { account: props?.env?.account, region: 'ap-southeast-1' },
      }),
    );
    // wave.addStage(
    //   new AppStacks(this, 'AppsUS', {
    //     env: { account: props?.env?.account, region: 'us-east-1' },
    //   }),
    // );
  }
}
