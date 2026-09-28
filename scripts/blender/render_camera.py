"""Renderiza uma ou mais câmeras do .blend no Cycles (GPU quando houver).
Uso: blender --background casa.blend --python render_camera.py -- pasta amostras Cam1 Cam2 ..."""
import bpy, sys, os
a = sys.argv[sys.argv.index('--') + 1:]
pasta, amostras, cams = a[0], int(a[1]), a[2:]
sc = bpy.context.scene
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'HIP'; prefs.get_devices()
    for d in prefs.devices: d.use = True
    sc.cycles.device = 'GPU'
except Exception: pass
sc.cycles.samples = amostras
sc.cycles.use_denoising = True
sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = 'PNG'
for c in cams:
    sc.camera = bpy.data.objects[c]
    sc.render.filepath = os.path.join(pasta, c + '.png')
    bpy.ops.render.render(write_still=True)
    print('RESULTADO', c)
