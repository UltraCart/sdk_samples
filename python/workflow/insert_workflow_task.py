# create a gift certificate
from ultracart.apis import WorkflowApi
from ultracart.model.workflow_task import WorkflowTask
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client
from datetime import datetime, timedelta
import random

api_instance = WorkflowApi(api_client())

try:

    merchant_id = 'DEMO'
    object_type = 'order'
    object_id = 'DEMO-0009104977'
    task_content = 'Your task, should you choose to accept it, is to call Perry and tell him what a wonderful developer he is'
    priority = '1 - low'
    due_dts = datetime.now() + timedelta(days=180)
    due_dts_iso8601 = due_dts.astimezone().isoformat('T', 'milliseconds')
    status = 'open'
    delay_dts = datetime.now() + timedelta(days=7)
    delay_dts_iso8601 = delay_dts.astimezone().isoformat('T', 'milliseconds')
    user_id = 70950 # (DEMO/perry)
    tags = ['idaho', 'snow', 'bleak', 'mooses', 'bit', 'my', 'brother']

    random_number = random.randint(1, 1000)
    task_name = 'Test Task No. ' + str(random_number)

    task_details = 'Here are some details for this task.  Blah blah blah'

    workflow_task = WorkflowTask(merchant_id=merchant_id,
                                 object_type=object_type,
                                 object_id=object_id,
                                 task_content=task_content,
                                 priority=priority,
                                 due_dts=due_dts_iso8601,
                                 status=status,
                                 delay_dts=delay_dts_iso8601,
                                 user_id=user_id,
                                 task_name=task_name,
                                 tags=tags,
                                 task_details=task_details)

    api_response = api_instance.insert_workflow_task(workflow_task)
    created_task = api_response.task

    pprint(created_task)

except ApiException as e:
    print("Exception when calling WorkflowApi->insert_workflow_task: %s\n" % e)
