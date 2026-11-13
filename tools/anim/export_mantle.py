# 导出 ALS 的「撑上 1m 障碍」动画（Mantle）供攀爬使用。
# 用法：
#   UnrealEditor-Cmd.exe D:/temp/als_export/AdvancedLocomotionSystemV.uproject \
#     -ExecutePythonScript="tools/anim/export_mantle.py" -unattended -nosplash -stdout
import unreal, os

OUT = 'D:/temp/als_anim_out'
os.makedirs(OUT, exist_ok=True)

BASE = '/Game/AdvancedLocomotionV4/CharacterAssets/MannequinSkeleton/AnimationExamples/Actions/'

# LH / RH = 左手撑 / 右手撑；2m 是更高的障碍版本，一并导出备用
NAMES = [
    'ALS_N_Mantle_1m_LH',
    'ALS_N_Mantle_1m_RH',
    'ALS_N_Mantle_2m',
]

def export(name):
    path = BASE + name
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
