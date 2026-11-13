import unreal, os

OUT = 'D:/temp/als_anim_out'
os.makedirs(OUT, exist_ok=True)

GROUPS = {
    'Locomotion': ['ALS_N_Walk_F', 'ALS_N_Run_F', 'ALS_N_Sprint_F'],
    'InAir': ['ALS_N_JumpLoop', 'ALS_N_FallLoop', 'ALS_N_Land_Light', 'ALS_N_Land_Heavy'],
    'TurnInPlace': ['ALS_N_TurnIP_L90', 'ALS_N_TurnIP_R90'],
    'BasePoses': ['ALS_N_Pose'],
    'Transitions': ['ALS_N_Stop_L_Down', 'ALS_N_Stop_R_Down'],
}

def export(group, name):
    path = '/Game/AdvancedLocomotionV4/CharacterAssets/MannequinSkeleton/AnimationExamples/Base/%s/%s' % (group, name)
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

for group, names in GROUPS.items():
    for n in names:
        try:
            export(group, n)
        except Exception as e:
            unreal.log_error('EXCEPTION on %s: %s' % (n, str(e)))

unreal.log('ALL DONE')
unreal.SystemLibrary.quit_editor()
