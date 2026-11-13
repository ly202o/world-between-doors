import unreal, os

OUT = 'D:/temp/als_anim_out'
os.makedirs(OUT, exist_ok=True)

BASE = '/Game/AdvancedLocomotionV4/CharacterAssets/MannequinSkeleton/AnimationExamples/Base/'

GROUP = 'InAir'
NAMES = ['ALS_N_JumpWalk_LF', 'ALS_N_JumpWalk_RF', 'ALS_N_JumpRun_LF', 'ALS_N_JumpRun_RF', 'ALS_N_FallLoop_Fast']

def export(name):
    path = BASE + GROUP + '/' + name
    asset = unreal.load_asset(path)
    if not asset:
        unreal.log_error('LOAD FAILED: ' + path)
        return
    out_file = os.path.join(OUT, name + '.fbx')
    task = unreal.AssetExportTask()
    task.set_editor_property('object', asset)
    task.set_editor_property('filename', out_file)
    task.set_editor_property('automated', True)
    task.set_editor_property('replace_identical', True)
    task.set_editor_property('exporter', unreal.AnimSequenceExporterFBX())
    unreal.Exporter.run_asset_export_task(task)
    unreal.log('EXPORTED: ' + out_file)

for n in NAMES:
    try:
        export(n)
    except Exception as e:
        unreal.log_error('EXCEPTION on %s: %s' % (n, str(e)))

unreal.log('ALL DONE')
unreal.SystemLibrary.quit_editor()
